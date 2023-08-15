# backstage-plugin

> This plugin not published yet

## Plan

Check out [proposal](https://docs.google.com/document/d/1_ePJ36DwFrhFPhcxhxXX__yiNzW1KDL83L2lfF8oIcA/edit?usp=sharing)

## Features

TBD

## Prerequisite

1. Get Litmus Auth Token in the cookie
2. In the `app-config.yaml` file root directory, add litmus proxy and info like below
   ```yaml
   proxy:
     '/litmus':
       target: 'https://litmus.namkyupark.tech'
       changeOrigin: true
   litmus:
     apiToken: LITMUS_AUTH_TOKEN
   ```
3. Adding annotations and values to your component file.
   ```yaml
   apiVersion: backstage.io/v1alpha1
   kind: Component
   metadata:
     name: component-name
     description: 'description'
     annotations:
       litmuschaos.io/project-id: 'your-own-project-id'
   ```
