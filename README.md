
## NoGe
NoGe is a project generator for [Node.js](https://nodejs.org) web frameworks (see [Supported Frameworks](#supported-frameworks)) with **optionally** a **ORM** (see [Supoorted ORMs](#supported-orms))

## Install

With npm:
```bash
npm install -g nog
```
With yarn:
```bash
yarn global add nog
```

## Project structure
```
|-- config
	|-- database.js
	|-- routes.js
|-- src
	|-- controllers 
		|-- .keep
	|-- models
		|-- .keep
	|-- services
		|-- .keep
|-- tests
	|-- controllers
		|-- .keep
	|-- models
		|-- .keep
	|-- services
		|-- .keep
|-- .env
|-- .env.example
|-- .gitignore
|-- index.js
|-- package.json
```
## The .keep file

Inside the **controllers**, **models** and **services** folders inside **src** and **tests** folders have a file named **.keep**. That is because git doesn't track empty folders. 
Feel free to delete these files if you want, but I recommend you to do it only after you push you project to your git or after you create some file inside them.

## Notes
- Parameters between `<>` are mandatory
- Parameters between `[]` are optional

## Commands

These are all the available commands

```
Options:

create <name>           create a new project with the given name
scaffold <name>         create a controller, model and route at the same time
controller <name>       create a controller
model <name>            create a model
service <name>			create a service
route <name>            create a route
```

## Commands options
These are all the available options for each command

### # create \<name\>
No options available

### # scaffold \<name\>

```
Options:

--no-spec                 do not generate spec file for the generated model and controller
--empty-controller        generate a controller without default actions. This overrides the actions option
--table                   the corresponding table name of the model
--has-many <model>[:[from, to]]		generate a has many relation with the specified model
--belongs-to <model>[:[from, to]]		generate a belongs to relation with the specified model
--has-one <model>[:[from, to]]		generate a has one relation with the specified model
--create-model-relations			create the models of the specified relations
```

### # scaffold \<name\> [--has-many | --has-one | --belongs-to]
| Option | Description |
| -- | -- |
| from | the id |
| to | the relation id |

Examples:

```bash
noge scaffold user --has-many product:[id, product_id]
noge scaffold product --belongs-to user:[user_id, id]
noge scaffold user --has-one address:[id, user_id]
```

### # controller \<name\>

```
Options:

--no-spec                                               do not generate spec file for the generated controller
--empty-controller                                      generate a controller without default actions. This overrides the actions option
--actions [index, show, create, update, destroy]        specify wich actions to generate
```

### # model \<name\>

```
Options:

--no-spec       					do not generate spec file for the generated model
--table         					the corresponding table name of the model
--has-many <model>[:[from, to]]		generate a has many relation with the specified model
--belongs-to <model>[:[from, to]]		generate a belongs to relation with the specified model
--has-one <model>[:[from, to]]		generate a has one relation with the specified model
--create-model-relations			create the models of the specified relations
```

### # model \<name\> [--has-many | --has-one | --belongs-to]
| Option | Description |
| -- | -- |
| from | the id |
| to | the relation id |

Examples:

```bash
noge model user --has-many product:[id, product_id]
noge model product --belongs-to user:[user_id, id]
noge model user --has-one address:[id, user_id]
```

### # service \<name\> [--actions, --empty-body, --project-path]

```
Options:

--empty-body			do not generate actions for the service
--actions <actions>		specify which actions to generate for the service
--project-path			the path for project dir if it is different from the current dir
```

Examples:

```
noge service user
noge service user --empty-body
noge service user --actions get,getOne,insert
noge service user --project-path projects/my-projetc
```

#### # Service options values
| Option | Values | Notes |
| -- | -- | -- |
| --actions | get,getOne,insert,update,delete | At least one is necessary if this option is present |

### # route \<name\> [actions...]

Examples:
```bash
noge route user
noge route user index, show, update
```

## Supported frameworks

- [Express](https://github.com/expressjs/express)

## Supported ORMs

 - [Objection.js](https://vincit.github.io/objection.js/)

## Contributing