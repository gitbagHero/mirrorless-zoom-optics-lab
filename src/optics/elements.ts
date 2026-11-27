export type LensKind = "standard" | "ed" | "asphericalEd" | "aspherical";

export const LENS_KINDS: Record<LensKind, string> = {
  standard: "常规镜片",
  ed: "ED 低色散",
  asphericalEd: "ED 非球面",
  aspherical: "非球面",
};

export const GROUPS = [
  { id: "G1", name: "前正组", description: "接收物方光线，建立进入变焦系统的光束。" },
  { id: "G2", name: "变倍负组", description: "以较强的负屈折力改变光束发散度，与相邻镜组协同变焦。" },
  { id: "G3", name: "中部正组", description: "光阑位于本组前方，组内 E09 和 E10 组成防抖子组。" },
  { id: "G4", name: "后部正组", description: "三对胶合镜片共同控制出射光束，E16 和 E17 可相对本组移动以合焦。" },
  { id: "G5", name: "弱负后组", description: "在像面前塑造出射光束。变焦时与光阑和 G3 同步移动。" },
] as const;

type GroupId = (typeof GROUPS)[number]["id"];

export interface LensElement {
  id: string;
  group: GroupId;
  front: number;
  back: number;
  drawRadius: number;
  kind: LensKind;
  shape: string;
  role: string;
  cementedTo?: string;
  mechanism?: string;
}

// Rim sizes are display estimates. Vertices and surface sag come from the prescription.
export const LENSES: readonly LensElement[] = [
  { id: "E01", group: "G1", front: 1, back: 2, drawRadius: 29.5, kind: "standard", shape: "负弯月", role: "第一片先改变入射光束的角度，两片 ED 正透镜再把这一组的净屈折力拉回正值。", mechanism: "物方外表面有氟涂层" },
  { id: "E02", group: "G1", front: 3, back: 4, drawRadius: 26.5, kind: "ed", shape: "正双凸", role: "它为前组提供会聚力。低色散玻璃能减轻不同波长在会聚时产生的焦点差异。" },
  { id: "E03", group: "G1", front: 5, back: 6, drawRadius: 25.5, kind: "ed", shape: "正弯月", role: "延续前组的正屈折力，以弯月曲面调节进入负组的光束。低色散玻璃帮助控制色差。" },
  { id: "E04", group: "G2", front: 7, back: 8, drawRadius: 14, kind: "standard", shape: "负弯月", role: "它是负组的第一片。两侧曲面共同使入射光束发散，为改变系统焦距提供屈折力。" },
  { id: "E05", group: "G2", front: 9, back: 10, drawRadius: 11.3, kind: "standard", shape: "负双凹", role: "双凹面继续提供负屈折力，帮助调整 E06 前的光线高度和方向。" },
  { id: "E06", group: "G2", front: 11, back: 12, drawRadius: 11.8, kind: "standard", shape: "正双凸", role: "在净屈折力为负的 G2 内提供局部会聚力，和同组负片共同分配光束偏折。" },
  { id: "E07", group: "G2", front: 13, back: 14, drawRadius: 11.5, kind: "standard", shape: "负弯月", role: "这片负弯月补充 G2 的负屈折力，并改变光线离开负组时的角度。" },
  { id: "E08", group: "G3", front: 16, back: 17, drawRadius: 10.6, kind: "standard", shape: "正双凸", role: "通过光阑的光线进入这片正透镜后开始增加会聚度，随后通过防抖双片。" },
  { id: "E09", group: "G3", front: 18, back: 19, drawRadius: 9.6, kind: "standard", shape: "负弯月", role: "它与 E10 胶合，为这对双片提供负屈折力。整对双片横向运动时能移动像点。", cementedTo: "E10", mechanism: "防抖子组" },
  { id: "E10", group: "G3", front: 19, back: 20, drawRadius: 9.6, kind: "standard", shape: "正双凸", role: "它为防抖双片提供正屈折力，与 E09 共用玻璃到玻璃的折射界面。", cementedTo: "E09", mechanism: "防抖子组" },
  { id: "E11", group: "G3", front: 21, back: 22, drawRadius: 10, kind: "standard", shape: "负双凹", role: "负屈折力调整离开 G3 的束角，让后组能在不同变焦档位接续成像。" },
  { id: "E12", group: "G4", front: 23, back: 24, drawRadius: 12.6, kind: "standard", shape: "正双凸", role: "它为后部正组提供会聚力，并和 E13 共用界面以控制合成光学功率。", cementedTo: "E13" },
  { id: "E13", group: "G4", front: 24, back: 25, drawRadius: 12.6, kind: "standard", shape: "负弯月", role: "负屈折力和与 E12 不同的色散，为胶合双片调节会聚力与色差提供自由度。", cementedTo: "E12" },
  { id: "E14", group: "G4", front: 26, back: 27, drawRadius: 12.2, kind: "standard", shape: "负弯月", role: "高折射率的负片与低色散正片 E15 胶合，两种玻璃的交界也会改变光线方向。", cementedTo: "E15" },
  { id: "E15", group: "G4", front: 27, back: 28, drawRadius: 12.2, kind: "asphericalEd", shape: "正双凸", role: "低色散减少不同波长的焦点偏差，非球面控制不同高度的光线折射。两种特性结合在同一片镜片上。", cementedTo: "E14" },
  { id: "E16", group: "G4", front: 29, back: 30, drawRadius: 12, kind: "standard", shape: "正双凸，近似平凸", role: "与 E17 构成小型可移动对焦双片，正屈折力参与设定双片的整体光学功率。", cementedTo: "E17", mechanism: "对焦子组" },
  { id: "E17", group: "G4", front: 30, back: 31, drawRadius: 12, kind: "aspherical", shape: "负双凹", role: "与 E16 一同向像面移动时可从远处对焦到近处。背面的非球面进一步控制边缘光束。", cementedTo: "E16", mechanism: "对焦子组" },
  { id: "E18", group: "G5", front: 32, back: 33, drawRadius: 14, kind: "aspherical", shape: "负弯月", role: "它与 E19 之间留有一道薄空气间隔。曲面和间隔共同影响最后一组镜片的出射光束。" },
  { id: "E19", group: "G5", front: 34, back: 35, drawRadius: 17, kind: "standard", shape: "正双凸", role: "最后一片给出射光束提供局部会聚力。光线离开它后继续传播到固定像面。" },
];
