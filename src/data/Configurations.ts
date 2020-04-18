import { Configurations as devend } from "./development.config";
import { Configurations as prdenv } from "./production.config";

import { ConfigurationsType } from "../types/ConfigurationsType";

export const Configurations: ConfigurationsType = process.env.BUILD_MODE == "production" ? prdenv : devend;
