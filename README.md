# aws-rest-api-serverless-lambda

Open-source hands-on guide to build real production ready rest api in Serverless manner

## Flow

1. Create Id and Key on [AWS console](https://console.aws.amazon.com/iam/home#/security_credentials) in "Access keys (access key ID and secret access key)" tab.
2. See `./sls/profiles` in repository to set or get available profiles names.
3. Create or update `~/.aws/config` and `~/.aws/credentials` on your machine to setup profiles in both files which you got on 2nd step.

```bash
[localawsenv]
aws_access_key_id=YOUR_ID
aws_secret_access_key=YOUR_KEY
```

4. Use alias for your profile dev01, dev02 etc. for ENV variable.
5. After deploy you can check your [api services](https://console.aws.amazon.com/apigateway/main/apis) and test endpoints.

## Build

`ENV=dev0x yarn build`

## Deploy

If build is packaged:
`ENV=dev0x yarn deploy-package`

Deploy entirely:
`ENV=dev0x yarn deploy`

To specify custom profile:
`ENV=dev0x PROFILE=local yarn deploy`

To specify another region
`ENV=dev0x PROFILE=local REGION=us-west-2 yarn deploy`
