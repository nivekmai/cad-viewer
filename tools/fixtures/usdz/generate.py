"""Synthetic USDZ fixtures. Run with Python and usd-core 26.11 installed."""
from pathlib import Path
import struct,zlib
from pxr import Usd, UsdGeom, UsdShade, UsdUtils, Sdf, Gf
root=Path(__file__).resolve().parent

def chunk(name,data):
    return struct.pack('>I',len(data))+name+data+struct.pack('>I',zlib.crc32(name+data))
png=b'\x89PNG\r\n\x1a\n'+chunk(b'IHDR',struct.pack('>2I5B',2,2,8,6,0,0,0))+chunk(b'IDAT',zlib.compress(bytes([0,255,0,0,255,255,255,255,255,0,0,0,255,255,0,255,0,255])))+chunk(b'IEND',b'')
(root/'checker.png').write_bytes(png)
stage=Usd.Stage.CreateNew(str(root/'scene.usda'))
UsdGeom.SetStageMetersPerUnit(stage,1)
UsdGeom.SetStageUpAxis(stage,UsdGeom.Tokens.z)
parent=UsdGeom.Xform.Define(stage,'/Model');stage.SetDefaultPrim(parent.GetPrim())
parent.AddTranslateOp().Set(Gf.Vec3d(3,4,5))
mesh=UsdGeom.Mesh.Define(stage,'/Model/Quad')
mesh.CreatePointsAttr([(0,0,0),(2,0,0),(2,1,0),(0,1,0)])
mesh.CreateFaceVertexCountsAttr([4]);mesh.CreateFaceVertexIndicesAttr([0,1,2,3]);mesh.CreateSubdivisionSchemeAttr('none');mesh.CreateDoubleSidedAttr(True)
uv=UsdGeom.PrimvarsAPI(mesh).CreatePrimvar('st',Sdf.ValueTypeNames.TexCoord2fArray,UsdGeom.Tokens.vertex);uv.Set([(0,0),(1,0),(1,1),(0,1)])
mat=UsdShade.Material.Define(stage,'/Model/Material')
shader=UsdShade.Shader.Define(stage,'/Model/Material/Surface');shader.CreateIdAttr('UsdPreviewSurface')
shader.CreateInput('diffuseColor',Sdf.ValueTypeNames.Color3f).Set((1,1,1))
tex=UsdShade.Shader.Define(stage,'/Model/Material/Texture');tex.CreateIdAttr('UsdUVTexture');tex.CreateInput('file',Sdf.ValueTypeNames.Asset).Set(Sdf.AssetPath('checker.png'))
reader=UsdShade.Shader.Define(stage,'/Model/Material/UV');reader.CreateIdAttr('UsdPrimvarReader_float2');reader.CreateInput('varname',Sdf.ValueTypeNames.Token).Set('st')
tex.CreateInput('st',Sdf.ValueTypeNames.Float2).ConnectToSource(reader.ConnectableAPI(),'result')
shader.GetInput('diffuseColor').ConnectToSource(tex.ConnectableAPI(),'rgb')
mat.CreateSurfaceOutput().ConnectToSource(shader.ConnectableAPI(),'surface');UsdShade.MaterialBindingAPI.Apply(mesh.GetPrim()).Bind(mat)
stage.GetRootLayer().Save()
assert UsdUtils.CreateNewUsdzPackage(Sdf.AssetPath(str(root/'scene.usda')),str(root/'textured-ascii.usdz'))
stage.GetRootLayer().Export(str(root/'scene.usdc'))
assert UsdUtils.CreateNewUsdzPackage(Sdf.AssetPath(str(root/'scene.usdc')),str(root/'textured-binary.usdz'))
stage.ClearMetadata('metersPerUnit');stage.GetRootLayer().Save()
assert UsdUtils.CreateNewUsdzPackage(Sdf.AssetPath(str(root/'scene.usda')),str(root/'default-units.usdz'))
for name in ['checker.png','scene.usda','scene.usdc']:(root/name).unlink()
