import type { SSTConfig } from "sst";
import { Bucket, Config, RemixSite } from "sst/constructs";
import { Effect, PolicyStatement, StarPrincipal } from "aws-cdk-lib/aws-iam";

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
      const COOKIE_SECRET = new Config.Secret(stack, "COOKIE_SECRET");

      const AWS_REGION_NAME = new Config.Parameter(stack, "AWS_REGION_NAME", {
        value: stack.region,
      });

      const profilePictureBucket = new Bucket(stack, "profilePicture", {
        cdk: {
          bucket: {
            publicReadAccess: true,
          },
        },
      });

      profilePictureBucket.attachPermissions([
        new PolicyStatement({
          effect: Effect.ALLOW,
          principals: [new StarPrincipal()],
          actions: ["s3:GetObject"],
          resources: [profilePictureBucket.bucketArn + "/*"],
        }),
      ]);

      const site = new RemixSite(stack, "site", {
        bind: [
          DATABASE_URL,
          COOKIE_SECRET,
          profilePictureBucket,
          AWS_REGION_NAME,
        ],
        runtime: "nodejs20.x",
      });

      stack.addOutputs({
        url: site.url,
      });
    });
  },
} satisfies SSTConfig;
