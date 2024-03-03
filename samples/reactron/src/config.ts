import configs from "../package.json";

const { projectId, projectConfigs } = configs as any;

export const config = { projectId, ...projectConfigs[projectId] };
