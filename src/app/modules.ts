export type ModuleId = 'workbench' | 'focus' | 'guide' | 'data'
export type ModuleIconName = 'lens' | 'focus' | 'guide' | 'data'

export type AppModule = {
  id: ModuleId
  label: string
  kicker: string
  number: string
  icon: ModuleIconName
}

export const appModules: AppModule[] = [
  { id: 'workbench', label: '工作台', kicker: 'WORKBENCH', number: '01', icon: 'lens' },
  { id: 'focus', label: '对焦', kicker: 'FOCUS', number: '02', icon: 'focus' },
  { id: 'guide', label: '导览', kicker: 'GUIDE', number: '03', icon: 'guide' },
  { id: 'data', label: '数据说明', kicker: 'DATA NOTES', number: '04', icon: 'data' },
]

export const moduleById = Object.fromEntries(
  appModules.map((module) => [module.id, module]),
) as Record<ModuleId, AppModule>

export function isModuleId(value: string): value is ModuleId {
  return appModules.some((module) => module.id === value)
}
