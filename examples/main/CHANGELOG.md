# Changelog

All notable changes to this project will be documented in this file.



##########
CHECK check CHECK package.json to make sure the version is correct before pushing
##########


TODO:
RELOAD THE MODEL THAT WAS USED IN A CHAT CONVERSATION. Eg. save the model config to the chat conversation somehow.



#####################################

## [0.0.9] - 2024-01-22

### Added
- 


### Changed
- All the system prompts are working and edited for each model


### Known Issues
- Model specific parameters are not being used. Only global is being used.









#####################################

## [0.0.8] - 2024-01-22

### Added
- system prompt and parameters are now unique to the model. config.ts 


### Changed
- 




#####################################

## [0.0.7] - 2024-01-22

### Added
- even more many new models
- system prompt. this was hard and took 4 hours. It is only using one system prompt for the entire system, eg. all models use one prompt. next thing to do is make it so each model uses it's own system prompt.


### Changed
- lots of files to get the above working. notes for this change are in the wllama_docs.txt



#####################################

## [0.0.6] - 2024-01-22

### Added
- even more many new models


### Changed
- 



#####################################

## [0.0.5] - 2024-01-22

### Added
- many new models


### Changed
- removed the ability to delete default models including the icon etc.




#####################################

## [0.0.4] - 2024-01-22

### Added
- Title to models


### Changed
- Manage models page order changed
- remove large model warning
- default first run now goes to new conversation



#####################################

## [0.0.3] - 2024-01-22

### Added
- make better decsions model
- alcohol addiction


### Changed
- Removed default wllama models from list




#####################################


## [0.0.2] - 2024-01-22

### Added
- Testing git push

### Changed
- No changes


#####################################

## [0.0.1] - 2024-01-22

### Added
- Make Better Decisions model to recommended models list
- Initial version control setup

### Changed
- Updated default inference parameters:
  - Context size: 2048
  - Temperature: 0.8
  - Max tokens: 200 