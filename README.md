NDLA Virtual Tour (360)
==========

This is a H5P content type that is based upon the [Virtual Tour (360)](https://h5p.org/virtual-tour-360) content type. Apart from the features in the original content type NDLA Virtual Tour (360) also includes the possibility to:
- Create clickable hotspot areas
- Lock interactive objects with a code
- Create playlists for scene and global audio
- Use same playlist on several scenes for uninterruptible playback
- Home button that can be hidden
- Labels on hotspots
- Different icons on text hotspots
- Clone scenes

## Getting started

This content type will run in the H5P plugin for WordPress, Drupal, and Moodle. It will also run in Edlib and Lumi. You might wanna install the H5P Virtual Tour (360) as well to make sure all content types are included.

Just download the latest release (.h5p file), and install it in your platform of choice.

## Development

Requirements

- Setup a local WordPress or Drupal environment. You can also use Docker. Just follow the guides at [H5P.org](https://h5p.org/development-environment).
- Install node.js.
- Install the [H5P cli](https://h5p.org/h5p-cli-guide).
- Download the files from GitHub or fork this repository, and put them in the H5P development folder.
- Start developing!

### Build project

Install all dependencies in the folder of the content type.

```
npm install
```

Build the project.

```
npm run build
```
If you need to pack a H5P library, follow the [H5P cli-guide](https://h5p.org/h5p-cli-guide).
