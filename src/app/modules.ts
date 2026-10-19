export type ModuleId = 'overview' | 'workbench' | 'focus' | 'guide' | 'data'

export type AppModule = {
  id: ModuleId
  label: string
  kicker: string
  number: string
}

export const appModules: AppModule[] = [
  { id: 'overview', label: '概览', kicker: 'OVERVIEW', number: '01' },
  { id: 'workbench', label: '工作台', kicker: 'WORKBENCH', number: '02' },
  { id: 'focus', label: '对焦', kicker: 'FOCUS', number: '03' },
  { id: 'guide', label: '导览', kicker: 'GUIDE', number: '04' },
  { id: 'data', label: '数据说明', kicker: 'DATA NOTES', number: '05' },
]

export const moduleById = Object.fromEntries(
  appModules.map((module) => [module.id, module]),
) as Record<ModuleId, AppModule>

export function isModuleId(value: string): value is ModuleId {
  return appModules.some((module) => module.id === value)
}
