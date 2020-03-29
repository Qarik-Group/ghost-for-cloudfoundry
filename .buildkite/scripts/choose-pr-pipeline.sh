#!/bin/bash

set -euo pipefail

: "${PR_WHITELIST:=}"
: "${RAW_REPO:=https://raw.githubusercontent.com/starkandwayne/ghost-for-cloudfoundry/production}"

found=no
for whitelist_org in $PR_WHITELIST; do
  if [[ $BUILDKITE_PULL_REQUEST_REPO =~ $whitelist_org ]]; then
    echo "# friendly"
    curl -sSL "${RAW_REPO}/.buildkite/pipeline.pr-friendly.yml"
    found=yes
  fi
done

[[ "${found}" == "no" ]] && {
  echo "# guest"
  curl -sSL "${RAW_REPO}/.buildkite/pipeline.pr-guest.yml"
}
