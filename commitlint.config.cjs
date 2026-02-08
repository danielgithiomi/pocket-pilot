module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "header-pattern": [
      2,
      "always",
      /^(feat|fix|refactor|config|setup)\([a-z0-9-]+\): PP-\d+ .+$/,
    ],
    "type-enum": [2, "always", ["feat", "fix", "refactor", "config", "setup"]],
    "subject-case": [0],
  },
};
