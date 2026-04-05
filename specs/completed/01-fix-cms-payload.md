# Spec: Fix CMS Payload Error

## Context
The CMS is throwing a `FUNCTION_PAYLOAD_TOO_LARGE` error when saving or creating drafts. This usually indicates that image assets are being encoded as base64 strings within the JSON payload rather than being handled as separate file uploads.

## Requirements
1. **Audit `keystatic.config.ts`**: Check the `posts` collection schema.
2. **Asset Configuration**: Ensure the `coverImage` or any content images are using the `path` or `directory` option to store files in `public/images/` rather than embedding them.
3. **Vercel/Serverless Limits**: If the project is deployed to Vercel, acknowledge the 4.5MB body size limit for Serverless Functions.
4. **Draft Validation**: Ensure the "draft" post that is currently visible but failing to save can be successfully updated or deleted after the fix.

## Verification
- Create a new test post in the CMS with a 2MB+ image.
- Confirm the image appears in `public/images/<slug>/` and the post saves without a 413 error.