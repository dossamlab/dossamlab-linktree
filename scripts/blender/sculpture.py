# Builds the "Dossam Lab" hero sculpture and the three group emblems, then renders them.
# Meshy props are read from art-raw/3d/<name>.glb; missing ones fall back to simple shapes.
#
# Run from the repo root:
#   blender -b --factory-startup -P scripts/blender/sculpture.py -- --mode test
#   blender -b --factory-startup -P scripts/blender/sculpture.py -- --mode turntable --frames 60
#   blender -b --factory-startup -P scripts/blender/sculpture.py -- --mode emblems
import argparse
import math
import os
import sys

import bpy
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
parser = argparse.ArgumentParser()
parser.add_argument("--mode", choices=["test", "turntable", "emblems"], default="test")
parser.add_argument("--frames", type=int, default=60)
parser.add_argument("--size", type=int, default=900)
parser.add_argument("--angle", type=float, default=30.0, help="test mode: turntable angle in degrees")
parser.add_argument("--samples", type=int, default=32)
args = parser.parse_args(argv)

PROPS_DIR = "art-raw/3d"
OUT_DIR = "art-raw/render"


def lin(hex_color):
    """sRGB hex to linear RGB tuple."""
    hex_color = hex_color.lstrip("#")
    out = []
    for i in (0, 2, 4):
        c = int(hex_color[i : i + 2], 16) / 255
        out.append(c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4)
    return tuple(out)


GOLD = "#F2C879"
NAVY = "#1B2050"
NAVY_TOP = "#262D6E"
LILAC = "#A9B8E8"
ROSE = "#E7C6DC"
MINT = "#CFE0D6"
SKY = "#9BB4D4"
CLOUD = "#ECE6FA"


# ---------- scene ----------
def reset_scene():
    for obj in list(bpy.data.objects):
        bpy.data.objects.remove(obj, do_unlink=True)
    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE"
    eevee = scene.eevee
    if hasattr(eevee, "taa_render_samples"):
        eevee.taa_render_samples = args.samples
    if hasattr(eevee, "use_raytracing"):
        eevee.use_raytracing = True
    if hasattr(eevee, "use_shadows"):
        eevee.use_shadows = True
    scene.render.film_transparent = True
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.resolution_x = scene.render.resolution_y = args.size
    scene.render.resolution_percentage = 100
    scene.view_settings.view_transform = "AgX"
    for look in ("AgX - Medium High Contrast", "Medium High Contrast"):
        try:
            scene.view_settings.look = look
            break
        except TypeError:
            pass

    # Studio-like environment: warm light above, lilac horizon, dark navy below. The film is transparent,
    # so this only shapes lighting and what the gold reflects.
    world = bpy.data.worlds.new("World")
    world.use_nodes = True
    nodes, links = world.node_tree.nodes, world.node_tree.links
    background = nodes["Background"]
    coords = nodes.new("ShaderNodeTexCoord")
    separate = nodes.new("ShaderNodeSeparateXYZ")
    ramp = nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.interpolation = "EASE"
    elements = ramp.color_ramp.elements
    elements[0].position, elements[0].color = 0.3, (*lin("#141838"), 1)
    elements[1].position, elements[1].color = 0.95, (*lin("#FFE7BD"), 1)
    horizon = elements.new(0.55)
    horizon.color = (*lin("#7E86CC"), 1)
    remap = nodes.new("ShaderNodeMapRange")
    remap.inputs["From Min"].default_value = -1.0
    remap.inputs["From Max"].default_value = 1.0
    links.new(coords.outputs["Normal"], separate.inputs["Vector"])
    links.new(separate.outputs["Z"], remap.inputs["Value"])
    links.new(remap.outputs["Result"], ramp.inputs["Fac"])
    links.new(ramp.outputs["Color"], background.inputs["Color"])
    background.inputs["Strength"].default_value = 1.1
    scene.world = world
    return scene


def material(name, color, metallic=0.0, roughness=0.5, emission=None, strength=0.0, transmission=0.0, subsurface=0.0, coat=0.0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (*lin(color), 1)
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    if emission:
        bsdf.inputs["Emission Color"].default_value = (*lin(emission), 1)
        bsdf.inputs["Emission Strength"].default_value = strength
    if transmission:
        bsdf.inputs["Transmission Weight"].default_value = transmission
    if subsurface:
        bsdf.inputs["Subsurface Weight"].default_value = subsurface
    if coat:
        bsdf.inputs["Coat Weight"].default_value = coat
    return mat


def planet_material():
    mat = bpy.data.materials.new("Planet")
    mat.use_nodes = True
    nodes, links = mat.node_tree.nodes, mat.node_tree.links
    bsdf = nodes["Principled BSDF"]
    noise = nodes.new("ShaderNodeTexNoise")
    noise.inputs["Scale"].default_value = 2.4
    noise.inputs["Detail"].default_value = 6.0
    noise.inputs["Distortion"].default_value = 3.2
    ramp = nodes.new("ShaderNodeValToRGB")
    elements = ramp.color_ramp.elements
    elements[0].position, elements[0].color = 0.3, (*lin("#7F8FE0"), 1)
    elements[1].position, elements[1].color = 0.82, (*lin("#FFF4DC"), 1)
    mid = elements.new(0.56)
    mid.color = (*lin(GOLD), 1)
    links.new(noise.outputs["Fac"], ramp.inputs["Fac"])
    links.new(ramp.outputs["Color"], bsdf.inputs["Base Color"])
    links.new(ramp.outputs["Color"], bsdf.inputs["Emission Color"])
    bsdf.inputs["Emission Strength"].default_value = 0.85
    bsdf.inputs["Roughness"].default_value = 0.45
    return mat


MATS = {}


def mats():
    if not MATS:
        MATS.update(
            gold=material("Gold", "#F7C35E", metallic=1.0, roughness=0.2),
            navy=material("Navy", NAVY, roughness=0.42, coat=0.4),
            navy_top=material("NavyTop", NAVY_TOP, roughness=0.6),
            cloud=material("Cloud", "#E4DEF7", roughness=0.9, subsurface=0.2),
            rock=material("Rock", "#4A4F86", roughness=0.75),
            bead=material("Bead", "#FFE6B0", emission="#FFD58A", strength=8.0),
            glass=material("Glass", "#FFFFFF", roughness=0.05, transmission=1.0),
            liquid=material("Liquid", MINT, emission="#9FF2CF", strength=3.0),
            rose=material("Rose", ROSE, roughness=0.6, subsurface=0.1),
            mint=material("Mint", MINT, roughness=0.6, subsurface=0.1),
            sky=material("Sky", SKY, roughness=0.55, subsurface=0.1),
            lilac=material("Lilac", LILAC, roughness=0.55, subsurface=0.1),
            leaf=material("Leaf", "#9FDDB8", roughness=0.5, emission="#7FE0A8", strength=0.8, subsurface=0.2),
            planet=planet_material(),
        )
    return MATS


def link(obj, parent=None):
    if obj.name not in bpy.context.collection.objects:
        bpy.context.collection.objects.link(obj)
    if parent:
        obj.parent = parent
    return obj


def smooth(obj):
    if obj.type == "MESH":
        if hasattr(obj.data, "shade_smooth"):
            obj.data.shade_smooth()
        else:
            for poly in obj.data.polygons:
                poly.use_smooth = True
    return obj


def add_mesh(kind, mat, parent, location=(0, 0, 0), scale=(1, 1, 1), rotation=(0, 0, 0), **kw):
    op = {
        "sphere": bpy.ops.mesh.primitive_uv_sphere_add,
        "ico": bpy.ops.mesh.primitive_ico_sphere_add,
        "cylinder": bpy.ops.mesh.primitive_cylinder_add,
        "cone": bpy.ops.mesh.primitive_cone_add,
        "torus": bpy.ops.mesh.primitive_torus_add,
        "cube": bpy.ops.mesh.primitive_cube_add,
    }[kind]
    op(location=location, rotation=rotation, **kw)
    obj = bpy.context.active_object
    obj.scale = scale
    obj.data.materials.append(mat)
    obj.parent = parent
    if kind in ("sphere", "ico", "torus"):
        smooth(obj)
    return obj


def bevel(obj, width=0.02, segments=3):
    mod = obj.modifiers.new("Bevel", "BEVEL")
    mod.width = width
    mod.segments = segments
    smooth(obj)
    return obj


def empty(name, parent=None, location=(0, 0, 0)):
    obj = bpy.data.objects.new(name, None)
    obj.location = location
    return link(obj, parent)


# ---------- props (Meshy or fallback) ----------
def world_bounds(objects):
    bpy.context.view_layer.update()
    lo = Vector((math.inf,) * 3)
    hi = Vector((-math.inf,) * 3)
    for obj in objects:
        if obj.type != "MESH":
            continue
        for corner in obj.bound_box:
            p = obj.matrix_world @ Vector(corner)
            lo = Vector(map(min, lo, p))
            hi = Vector(map(max, hi, p))
    return lo, hi


def import_prop(name):
    path = os.path.join(PROPS_DIR, f"{name}.glb")
    if not os.path.exists(path):
        return None
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=path)
    new = [o for o in bpy.data.objects if o not in before]
    root = empty(f"prop-{name}")
    for obj in new:
        if obj.parent is None:
            obj.parent = root
        smooth(obj)
    # Center on the origin with the base at z=0 and a height of 1.
    lo, hi = world_bounds(new)
    size = max(hi - lo) or 1.0
    for obj in new:
        if obj.parent == root:
            obj.location -= Vector(((lo.x + hi.x) / 2, (lo.y + hi.y) / 2, lo.z))
    root.scale = (1 / size,) * 3
    print(f"[prop] imported {path}")
    return root


def fallback_prop(name):
    m = mats()
    root = empty(f"prop-{name}")
    if name == "flask":
        add_mesh("sphere", m["glass"], root, (0, 0, 0.32), (0.32, 0.32, 0.32), segments=32, ring_count=16)
        add_mesh("sphere", m["liquid"], root, (0, 0, 0.27), (0.25, 0.25, 0.2), segments=32, ring_count=16)
        add_mesh("cylinder", m["glass"], root, (0, 0, 0.72), (0.1, 0.1, 0.18), vertices=24)
        add_mesh("cylinder", m["rose"], root, (0, 0, 0.93), (0.11, 0.11, 0.06), vertices=24)
    elif name == "telescope":
        add_mesh("cylinder", m["gold"], root, (0, 0, 0.62), (0.1, 0.1, 0.42), (math.radians(60), 0, 0), vertices=24)
        for a in (0, 120, 240):
            r = math.radians(a)
            add_mesh("cylinder", m["navy"], root, (0.14 * math.cos(r), 0.14 * math.sin(r), 0.22), (0.02, 0.02, 0.24), (0.35 * math.sin(r), -0.35 * math.cos(r), 0), vertices=12)
    elif name == "rocket":
        add_mesh("cylinder", m["lilac"], root, (0, 0, 0.42), (0.16, 0.16, 0.3), vertices=32)
        add_mesh("cone", m["gold"], root, (0, 0, 0.86), (0.16, 0.16, 0.16), vertices=32)
        add_mesh("sphere", m["sky"], root, (0, -0.15, 0.5), (0.06, 0.03, 0.06))
        for a in (0, 120, 240):
            r = math.radians(a)
            add_mesh("cube", m["gold"], root, (0.17 * math.cos(r), 0.17 * math.sin(r), 0.16), (0.06, 0.012, 0.09), (0, 0, r))
    elif name == "books":
        for i, key in enumerate(("rose", "mint", "sky")):
            bevel(add_mesh("cube", m[key], root, (0, 0, 0.09 + i * 0.17), (0.32 - i * 0.03, 0.24, 0.075), (0, 0, math.radians(i * 9))), 0.03)
    elif name == "sprout":
        add_mesh("sphere", m["rock"], root, (0, 0, 0.14), (0.16, 0.16, 0.13))
        add_mesh("cylinder", m["leaf"], root, (0, 0, 0.36), (0.025, 0.025, 0.2), vertices=12)
        add_mesh("sphere", m["leaf"], root, (0.14, 0, 0.6), (0.17, 0.08, 0.05), (0, math.radians(-25), 0))
        add_mesh("sphere", m["leaf"], root, (-0.14, 0, 0.6), (0.17, 0.08, 0.05), (0, math.radians(25), 0))
    elif name == "race-car":
        bevel(add_mesh("cube", m["sky"], root, (0, 0, 0.2), (0.34, 0.17, 0.08)), 0.06)
        add_mesh("sphere", m["glass"], root, (0.04, 0, 0.3), (0.12, 0.1, 0.08))
        for x in (-0.22, 0.22):
            for y in (-0.17, 0.17):
                add_mesh("cylinder", m["navy"], root, (x, y, 0.1), (0.08, 0.08, 0.04), (math.radians(90), 0, 0), vertices=20)
    return root


def prop(name):
    return import_prop(name) or fallback_prop(name)


# ---------- sculpture ----------
def helix_point(t, r0, r1, z0, z1, turns):
    a = t * turns * 2 * math.pi
    r = r0 + (r1 - r0) * t
    return Vector((r * math.cos(a), r * math.sin(a), z0 + (z1 - z0) * t)), a


def build_sculpture():
    m = mats()
    root = empty("Sculpture")

    # Pedestal with gold rims, like the card illustrations.
    bevel(add_mesh("cylinder", m["navy"], root, (0, 0, 0.16), (1.18, 1.18, 0.16), vertices=96), 0.03, 4)
    add_mesh("cylinder", m["navy_top"], root, (0, 0, 0.325), (1.06, 1.06, 0.012), vertices=96)
    for z, r in ((0.02, 1.2), (0.31, 1.16)):
        add_mesh("torus", m["gold"], root, (0, 0, z), (1, 1, 1), major_radius=r, minor_radius=0.03, major_segments=128, minor_segments=16)

    # Soft clay cloud puffs and rocks on top.
    for x, y, s in ((-0.62, 0.35, 0.13), (0.6, -0.42, 0.14), (0.66, 0.36, 0.11), (-0.68, -0.3, 0.12), (0.08, 0.8, 0.1), (-0.2, -0.8, 0.11)):
        for dx, dy, k in ((0, 0, 1.0), (0.11, 0.04, 0.75), (-0.1, 0.06, 0.7), (0.02, -0.09, 0.65)):
            r = s * k
            add_mesh("sphere", m["cloud"], root, (x + dx * s * 6, y + dy * s * 6, 0.34 + r * 0.7), (r, r, r * 0.85), segments=24, ring_count=12)
    for x, y, s in ((-0.35, 0.2, 0.12), (0.3, 0.45, 0.1), (0.15, -0.35, 0.11)):
        add_mesh("ico", m["rock"], root, (x, y, 0.38), (s, s, s * 1.3), subdivisions=1)

    # Glowing planet with a light inside that shines through onto the spiral.
    planet = add_mesh("sphere", m["planet"], root, (0, 0, 1.22), (0.5, 0.5, 0.5), segments=64, ring_count=32)
    planet.visible_shadow = False
    glow = bpy.data.lights.new("PlanetGlow", "POINT")
    glow.energy = 120
    glow.color = lin("#FFE2A8")
    link(bpy.data.objects.new("PlanetGlow", glow), root).location = (0, 0, 1.22)

    # Gold spiral track (DoRms spiral motif) rising around the planet.
    r0, r1, z0, z1, turns = 0.92, 0.72, 0.42, 2.02, 2.25
    curve = bpy.data.curves.new("Spiral", "CURVE")
    curve.dimensions = "3D"
    spline = curve.splines.new("POLY")
    steps = 480
    spline.points.add(steps)
    for i in range(steps + 1):
        p, _ = helix_point(i / steps, r0, r1, z0, z1, turns)
        spline.points[i].co = (*p, 1)
    curve.bevel_depth = 0.032
    curve.bevel_resolution = 6
    curve.use_fill_caps = True
    spiral = link(bpy.data.objects.new("Spiral", curve), root)
    spiral.data.materials.append(m["gold"])

    # Little lights along the track.
    for i in range(36):
        p, _ = helix_point((i + 0.5) / 36, r0, r1, z0, z1, turns)
        add_mesh("sphere", m["bead"], root, (p.x, p.y, p.z + 0.045), (0.022, 0.022, 0.022), segments=12, ring_count=8)

    # Science props riding the spiral.
    for name, t in (("race-car", 0.08), ("books", 0.25), ("flask", 0.42), ("telescope", 0.6), ("sprout", 0.76), ("rocket", 0.93)):
        p, a = helix_point(t, r0, r1, z0, z1, turns)
        holder = empty(f"slot-{name}", root, (p.x, p.y, p.z + 0.03))
        holder.rotation_euler = (0, 0, a + math.pi / 2)
        item = prop(name)
        item.parent = holder
        item.scale = tuple(c * 0.3 for c in item.scale)
    return root


# ---------- lights and camera ----------
def area_light(name, color, energy, size, location, target=(0, 0, 1.1)):
    light = bpy.data.lights.new(name, "AREA")
    light.energy = energy
    light.size = size
    light.color = lin(color)
    obj = link(bpy.data.objects.new(name, light))
    obj.location = location
    direction = Vector(target) - Vector(location)
    obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
    return obj


def setup_view(target_z=1.15, distance=6.1, elevation=17, lens=60):
    area_light("Key", "#FFD9A0", 650, 3.0, (-3.2, -3.4, 4.2))
    area_light("Rim", "#B8C4FF", 520, 2.5, (3.0, 3.2, 2.8))
    area_light("Fill", "#8F9BE0", 160, 4.0, (3.5, -2.5, 1.2))
    card_mat = material("LightCard", "#FFFFFF", emission="#FFF1D6", strength=3.0)
    for location, rotation in (((-3.0, -1.0, 3.2), (math.radians(60), 0, math.radians(-70))), ((2.8, -2.2, 2.6), (math.radians(65), 0, math.radians(50)))):
        bpy.ops.mesh.primitive_plane_add(size=2.6, location=location, rotation=rotation)
        card = bpy.context.active_object
        card.data.materials.append(card_mat)
        card.visible_camera = False
        card.visible_shadow = False
    cam_data = bpy.data.cameras.new("Camera")
    cam_data.lens = lens
    cam = link(bpy.data.objects.new("Camera", cam_data))
    e = math.radians(elevation)
    cam.location = (0, -distance * math.cos(e), target_z + distance * math.sin(e))
    direction = Vector((0, 0, target_z)) - cam.location
    cam.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
    bpy.context.scene.camera = cam


def render_to(path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    bpy.context.scene.render.filepath = os.path.abspath(path)
    bpy.ops.render.render(write_still=True)
    print(f"[render] {path}")


# ---------- emblems ----------
def build_emblem(kind):
    m = mats()
    root = empty(f"Emblem-{kind}")
    if kind == "dorms":
        bevel(add_mesh("cylinder", m["navy"], root, (0, 0, 0.5), (0.62, 0.62, 0.09), (math.radians(90), 0, 0), vertices=96), 0.03, 4)
        add_mesh("torus", m["gold"], root, (0, -0.1, 0.5), (1, 1, 1), (math.radians(90), 0, 0), major_radius=0.62, minor_radius=0.035, major_segments=128, minor_segments=16)
        curve = bpy.data.curves.new("TokenSpiral", "CURVE")
        curve.dimensions = "3D"
        spline = curve.splines.new("POLY")
        steps = 220
        spline.points.add(steps)
        for i in range(steps + 1):
            t = i / steps
            a = t * 2.6 * 2 * math.pi
            r = 0.06 + 0.4 * t
            spline.points[i].co = (r * math.cos(a), -0.11, 0.5 + r * math.sin(a), 1)
        curve.bevel_depth = 0.04
        curve.bevel_resolution = 6
        curve.use_fill_caps = True
        obj = link(bpy.data.objects.new("TokenSpiral", curve), root)
        obj.data.materials.append(m["gold"])
    elif kind == "science":
        flask = prop("flask")
        flask.parent = root
        for tilt in (0, 60, 120):
            add_mesh("torus", m["gold"], root, (0, 0, 0.5), (1, 1, 1), (math.radians(70), 0, math.radians(tilt)), major_radius=0.62, minor_radius=0.014, major_segments=96, minor_segments=8)
    elif kind == "classroom":
        sprout = prop("sprout")
        sprout.parent = root
        for i in range(10):
            a = i / 10 * 2 * math.pi
            add_mesh("sphere", m["bead"], root, (0.5 * math.cos(a), 0.5 * math.sin(a), 0.08), (0.03, 0.03, 0.03), segments=12, ring_count=8)
    return root


# ---------- main ----------
reset_scene()
if args.mode in ("test", "turntable"):
    sculpture = build_sculpture()
    setup_view()
    if args.mode == "test":
        sculpture.rotation_euler.z = math.radians(args.angle)
        render_to(f"{OUT_DIR}/test.png")
    else:
        for i in range(args.frames):
            sculpture.rotation_euler.z = 2 * math.pi * i / args.frames
            render_to(f"{OUT_DIR}/sculpture/f-{i:03d}.png")
else:
    setup_view(target_z=0.5, distance=3.4, elevation=20, lens=60)
    for kind in ("dorms", "science", "classroom"):
        root = build_emblem(kind)
        render_to(f"{OUT_DIR}/emblems/{kind}.png")
        for obj in [root, *root.children_recursive]:
            bpy.data.objects.remove(obj, do_unlink=True)
