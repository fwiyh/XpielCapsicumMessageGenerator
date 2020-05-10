import { Configurations as devend } from "./development.config";
import { Configurations as prdenv } from "./production.config";

import { ConfigurationType } from "../types/position/ConfigurationType";

export const Configurations: ConfigurationType = process.env.BUILD_MODE == "production" ? prdenv : devend;
