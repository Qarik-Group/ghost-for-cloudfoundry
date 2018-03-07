#!/bin/bash

appname=${appname:-ghost}
export DEBUG=${DEBUG:-}

if [[ "${VCAP_SERVICES:-X}" == "X" ]]; then
  echo "Running outside Cloud Foundry. Looking up \$VCAP_SERVICES..."
  if [[ ! -f ~/.cf/config.json ]]; then
    echo "ERROR: run 'cf login' to login and target a space"
    exit 1
  fi
  space_guid=$(jq -r ".SpaceFields.GUID // \"X\"" ~/.cf/config.json)
  if [[ "${space_guid}" == "X" ]]; then
    echo "ERROR: run 'cf target -s space' to target a space"
    exit 1
  fi
  cf_curl_app_url=$(cf curl "/v2/spaces/${space_guid}/apps?q=name:${appname}" | jq -r ".resources[0].metadata.url")
  [[ -n $DEBUG ]] && { echo $cf_curl_app_url; }

  VCAP_SERVICES=$(cf curl "${cf_curl_app_url}/env" | jq -r '.system_env_json.VCAP_SERVICES // ""')
  [[ -n $DEBUG ]] && { echo "$VCAP_SERVICES" | jq -r .; }
  export VCAP_SERVICES

  VCAP_APPLICATION=$(cf curl "${cf_curl_app_url}/env" | jq -r '.application_env_json.VCAP_APPLICATION // ""')
  [[ -n $DEBUG ]] && { echo "$VCAP_APPLICATION" | jq -r .; }
  export VCAP_APPLICATION
fi
