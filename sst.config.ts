import type { SSTConfig } from "sst";
import { Config, RemixSite } from "sst/constructs";

export default {
  config(_input) {
    return {
      name: "link-sharing-app-2",
      region: "ap-south-1",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const DATABASE_URL = new Config.Secret(stack, "DATABASE_URL");

      const site = new RemixSite(stack, "site", { bind: [DATABASE_URL] });

      stack.addOutputs({
        url: site.url,
      });
    });
  },
} satisfies SSTConfig;
