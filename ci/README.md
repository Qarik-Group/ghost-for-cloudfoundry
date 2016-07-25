# CI pipeline

Install:

```
fly -t vsphere sp -p $(basename $(pwd)) -c ci/pipeline.yml -l ci/credentials.yml
fly -t vsphere unpause-pipeline -p $(basename $(pwd))
```

Update:

```
fly -t vsphere sp -p $(basename $(pwd)) -c ci/pipeline.yml -l ci/credentials.yml
```
