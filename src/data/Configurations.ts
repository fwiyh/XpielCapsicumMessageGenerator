import * as devenv from "./development.config";
import * as prdenv from "./production.config";
import { ConfigurationsType } from "../entity/ConfigurationsType";

const Configurations: ConfigurationsType
     = process.env.BUILD_MODE == "production" ? prdenv.Configurations : devenv.Configurations;

export { Configurations };
