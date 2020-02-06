
# NoGe
NoGe is a project generator for [Node.js](https://nodejs.org) web frameworks (see [Supported Frameworks](#supported-frameworks)) with **optionally** a **ORM** (see [Supoorted ORMs](#supported-orms))

## Install

With npm:
```bash
npm install -g noge
```
With yarn:
```bash
yarn global add noge
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

This file is created because git doesn't track empty folders. 
Feel free to delete these files if you want, but I recommend you to do it only after you push your project or after create some file inside the folders.

## Notes
- Parameters between `<>` are required
- Parameters between `[]` are optional
- `...` means that it accepts more than one value separeted by spaces

## Commands

These are all the available commands

```
Options:

create <name>              create a new project with the given name
scaffold <name>            create a controller, model and route at the same time
controller <names...>      create a controller
model <names...>           create a model
service <names...>         create a service
route <name>               create a route
```

## Commands options
These are all the available options for each command

### # create \<name\>

```
Options:

--no-specs 		   create project without the tests folder
--ignore-setup             ignore the initial setup of the project (name and version)
--ignore-dependencies      ignore the install of the node_modules
--silent 		   do not show any logs while creating
```

### # scaffold \<name\>

```
Options:

--empty-controller                     generate a controller without default actions. This overrides the --actions-controller
--empty-service                        generate an action without default actions. This overrides the --actions-service
--actions-controller		       specify wich actions to generate: Available values are: index, show, create, update and destroy
--actions-service                      specify wich actions to generate: Available values are: get, getOne, insert, update, destroy
--no-spec			       do not generate spec file for the generated model and controller
--table                   	       the corresponding table name of the model
--has-many <model>[:[from, to]]	       generate a has many relation with the specified model
--belongs-to <model>[:[from, to]]      generate a belongs to relation with the specified model
--has-one <model>[:[from, to]]         generate a has one relation with the specified model
--create-relations                     create the models of the specified relations
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

### # controller \<names...\>

```
Options:

--actions <actions>      specify wich actions to generate: Available values are: index, show, create, update and destroy
--no-spec                do not generate spec file for the generated controller
--empty                  generate a controller without default actions. This overrides the actions option
```

Examples:

```
noge controller user
noge controller user --empty
noge controller user --actions index,show,destroy
```

### # model \<names...\>

```
Options:

--no-spec                              do not generate spec file for the generated model
-t, --table                            the corresponding table name of the model
--has-many <model>[:[from, to]]	       generate a has many relation with the specified model
--belongs-to <model>[:[from, to]]      generate a belongs to relation with the specified model
--has-one <model>[:[from, to]]         generate a has one relation with the specified model
--create-relations                     create the models of the specified relations
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

### # service \<names...\>

```
Options:

--actions <actions>      specify wich actions to generate: Available values are: get, getOne, insert, update, destroy
--empty                  generate a service without default actions. This overrides the --actions
--project-path           the path for project dir if it is different from the current dir
```

Examples:

```
noge service user
noge service user --empty
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
 
## Testing

For testing just go to the root or to `tests` folder and run:

```bash
yarn test
```
or
```bash
npm test
```



## Contributing
