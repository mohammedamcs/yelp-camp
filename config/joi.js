const baseJoi = require("joi");

//sanitize-html allows you to specify the tags you want to permit, and the permitted attributes for each of those tags.
const sanitizeHtml = require("sanitize-html");

// Extension to prevent XSS injection from attacker
const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

module.exports = baseJoi.extend(extension);