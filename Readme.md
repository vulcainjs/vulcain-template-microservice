# Default micro-service template to use with vulcain framework

## Prerequisites

- node 6.0 see [this link](https://nodejs.org/en/download/) to install node on your machine.
- docker version > 1.12. See [this link](https://docs.docker.com/engine/installation/) to install docker.
- **vulcain-cli** is not mandatory but can help you to start easily whith **vulcain**. Install it whith

```js
npm install vulcain-cli -g
```

## Creating a simple microservice

### Option 1

After installing ***vulcain-cli***, run ```vulcain init my-service```.

### Option 2

Clone the starter template from ```github``` with

```git clone https://github.com/vulcainjs/vulcain-template-microservice.git my-service```

and replace all '<%= project.fullName %>' project occurences with ```my-service``` and '<%=project.namespace%>' by ```my-domain``` in ```startup.ts```.
