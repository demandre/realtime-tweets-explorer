// Libs
var Backbone = require('backbone');
var akTemplate = require('ak-template');
const THREE = require('three');
var OrbitControls = require('three-orbit-controls')(THREE);
var dat = require('dat.gui');
// Template
var tpl = require('./index.tpl');

// Controller - view
module.exports = Backbone.View.extend({
  'el': '.tweet-explorer',
  'template': akTemplate(tpl),
  'render': function render () {
    /**
    var container = Backbone.$(this.template()).appendTo(this.$el);
    var renderer = new THREE.WebGLRenderer();

    renderer.setSize(500, 500);
    var camera = new THREE.PerspectiveCamera(45, 500 / 500, 0.1, 10000);

    camera.position.set(0, 0, 500);
    var scene = new THREE.Scene();

    scene.background = new THREE.Color(0x000);
    scene.add(camera);
    var globe = new THREE.Group();

    scene.add(globe);
    var loader = new THREE.TextureLoader();

    loader.load(require('../../../../assets/land_ocean_ice_cloud_2048.jpg'), function load (texture) {
      // Create the sphere
      var sphere = new THREE.SphereGeometry(200, 50, 50);
      // Map the texture to the material.
      var material = new THREE.MeshBasicMaterial({'map': texture, 'overdraw': 0.5});
      // Create a new mesh with sphere geometry.
      var mesh = new THREE.Mesh(sphere, material);

      // Add mesh to globe
      globe.add(mesh);
    });
    globe.position.z = - 300;
    var pointLight = new THREE.PointLight(0xFFFFFF);

    pointLight.position.x = 10;
    pointLight.position.y = 50;
    pointLight.position.z = 400;
    scene.add(pointLight);

    container.append(renderer.domElement);
**/

    // Scene, Camera, Renderer
    let renderer = new THREE.WebGLRenderer();
    let scene = new THREE.Scene();
    let aspect = window.innerWidth / window.innerHeight;
    let camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1500);
    let cameraRotation = 0;
    let cameraRotationSpeed = 0.001;
    let cameraAutoRotation = true;
    let orbitControls = new OrbitControls(camera);

    // Lights
    let spotLight = new THREE.SpotLight(0xffffff, 1, 0, 10, 2);

    // Texture Loader
    let textureLoader = new THREE.TextureLoader();

    // Planet Proto
    let planetProto = {
      'sphere': function sphere (size) {
        let sphere1 = new THREE.SphereGeometry(size, 32, 32);

        return sphere1;
      },
      'material': function material (options) {
        let material1 = new THREE.MeshPhongMaterial();

        if (options) {
          for (var property in options) {
            material1[property] = options[property];
          }
        }

        return material1;
      },
      'glowMaterial': function glowMaterial (intensity, fade, color) {
        // Custom glow shader from https://github.com/stemkoski/stemkoski.github.com/tree/master/Three.js
        let glowMaterial1 = new THREE.ShaderMaterial({
          'uniforms': {
            'c': {
              'type': 'f',
              'value': intensity
            },
            'p': {
              'type': 'f',
              'value': fade
            },
            'glowColor': {
              'type': 'c',
              'value': new THREE.Color(color)
            },
            'viewVector': {
              'type': 'v3',
              'value': camera.position
            }
          },
          'vertexShader': `
            uniform vec3 viewVector;
            uniform float c;
            uniform float p;
            varying float intensity;
            void main() {
              vec3 vNormal = normalize( normalMatrix * normal );
              vec3 vNormel = normalize( normalMatrix * viewVector );
              intensity = pow( c - dot(vNormal, vNormel), p );
              gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            }`,
          'fragmentShader': `
            uniform vec3 glowColor;
            varying float intensity;
            void main()
            {
              vec3 glow = glowColor * intensity;
              gl_FragColor = vec4( glow, 1.0 );
            }`,
          'side': THREE.BackSide,
          'blending': THREE.AdditiveBlending,
          'transparent': true
        });

        return glowMaterial1;
      },
      'texture': function texture (material, property, uri) {
        let textureLoader = new THREE.TextureLoader();

        textureLoader.crossOrigin = true;
        textureLoader.load(
          uri,
          function textureLoad (texture) {
            material[property] = texture;
            material.needsUpdate = true;
          }
        );
      }
    };

    let createPlanet = function createPlanet (options) {
      // Create the planet's Surface
      let surfaceGeometry = planetProto.sphere(options.surface.size);
      let surfaceMaterial = planetProto.material(options.surface.material);
      let surface = new THREE.Mesh(surfaceGeometry, surfaceMaterial);

      // Create the planet's Atmosphere
      let atmosphereGeometry = planetProto.sphere(options.surface.size + options.atmosphere.size);
      let atmosphereMaterialDefaults = {
        'side': THREE.DoubleSide,
        'transparent': true
      };
      let atmosphereMaterialOptions = Object.assign(atmosphereMaterialDefaults, options.atmosphere.material);
      let atmosphereMaterial = planetProto.material(atmosphereMaterialOptions);
      let atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);

      // Create the planet's Atmospheric glow
      let atmosphericGlowGeometry = planetProto.sphere(options.surface.size + options.atmosphere.size + options.atmosphere.glow.size);
      let atmosphericGlowMaterial = planetProto.glowMaterial(options.atmosphere.glow.intensity, options.atmosphere.glow.fade, options.atmosphere.glow.color);
      let atmosphericGlow = new THREE.Mesh(atmosphericGlowGeometry, atmosphericGlowMaterial);

      // Nest the planet's Surface and Atmosphere into a planet object
      let planet = new THREE.Object3D();

      surface.name = 'surface';
      atmosphere.name = 'atmosphere';
      atmosphericGlow.name = 'atmosphericGlow';
      planet.add(surface);
      planet.add(atmosphere);
      planet.add(atmosphericGlow);

      // Load the Surface's textures
      for (let textureProperty in options.surface.textures) {
        planetProto.texture(
          surfaceMaterial,
          textureProperty,
          options.surface.textures[textureProperty]
        );
      }

      // Load the Atmosphere's texture
      for (let textureProperty in options.atmosphere.textures) {
        planetProto.texture(
          atmosphereMaterial,
          textureProperty,
          options.atmosphere.textures[textureProperty]
        );
      }

      return planet;
    };

    let earth = createPlanet({
      'surface': {
        'size': 0.5,
        'material': {
          'bumpScale': 0.05,
          'specular': new THREE.Color('blue'),
          'shininess': 10
        },
        'textures': {
          'map': 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/earthmap1k.jpg',
          'bumpMap': 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/earthbump1k.jpg',
          'specularMap': 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/earthspec1k.jpg'
        }
      },
      'atmosphere': {
        'size': 0.003,
        'material': {
          'opacity': 0.8
        },
        'textures': {
          'map': 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/earthcloudmap.jpg',
          'alphaMap': 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/earthcloudmaptrans.jpg'
        },
        'glow': {
          'size': 0.02,
          'intensity': 0.7,
          'fade': 7,
          'color': 0x93cfef
        }
      }
    });

    // Marker Proto
    let markerProto = {
      'latLongToVector3': function latLongToVector3 (latitude, longitude, radius, height) {
        var phi = latitude * Math.PI / 180;
        var theta = (longitude - 180) * Math.PI / 180;

        var x = - (radius + height) * Math.cos(phi) * Math.cos(theta);
        var y = (radius + height) * Math.sin(phi);
        var z = (radius + height) * Math.cos(phi) * Math.sin(theta);

        return new THREE.Vector3(x, y, z);
      },
      'marker': function marker (size, color, vector3Position) {
        let markerGeometry = new THREE.SphereGeometry(size);
        let markerMaterial = new THREE.MeshLambertMaterial({
          'color': color
        });
        let markerMesh = new THREE.Mesh(markerGeometry, markerMaterial);

        markerMesh.position.copy(vector3Position);

        return markerMesh;
      }
    };

    // Place Marker
    let placeMarker = function placeMarker (object, options) {
      let position = markerProto.latLongToVector3(options.latitude, options.longitude, options.radius, options.height);
      let marker = markerProto.marker(options.size, options.color, position);

      object.add(marker);
    };

    // Place Marker At Address
    let placeMarkerAtAddress = function placeMarkerAtAddress (address, color) {
      let encodedLocation = address.replace(/\s/g, '+');
      let httpRequest = new XMLHttpRequest();

      httpRequest.open('GET', 'https://maps.googleapis.com/maps/api/geocode/json?address=' + encodedLocation);
      httpRequest.send(null);
      httpRequest.onreadystatechange = function onreadystatechange () {
        if (httpRequest.readyState === 4 && httpRequest.status === 200) {
          let result = JSON.parse(httpRequest.responseText);

          if (result.results.length > 0) {
            let latitude = result.results[0].geometry.location.lat;
            let longitude = result.results[0].geometry.location.lng;

            placeMarker(earth.getObjectByName('surface'), {
              'latitude': latitude,
              'longitude': longitude,
              'radius': 0.5,
              'height': 0,
              'size': 0.01,
              'color': color
            });
          }
        }
      };
    };

    // Galaxy
    let galaxyGeometry = new THREE.SphereGeometry(100, 32, 32);
    let galaxyMaterial = new THREE.MeshBasicMaterial({
      'side': THREE.BackSide
    });
    let galaxy = new THREE.Mesh(galaxyGeometry, galaxyMaterial);

    // Load Galaxy Textures
    textureLoader.crossOrigin = true;
    textureLoader.load(
      'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/starfield.png',
      function textureLoad (texture) {
        galaxyMaterial.map = texture;
        scene.add(galaxy);
      }
    );

    // Scene, Camera, Renderer Configuration
    renderer.setSize(window.innerWidth, window.innerHeight);
    this.$el.append(renderer.domElement);

    camera.position.set(1, 1, 1);
    orbitControls.enabled = ! cameraAutoRotation;

    scene.add(camera);
    scene.add(spotLight);
    scene.add(earth);

    // Light Configurations
    spotLight.position.set(2, 0, 1);

    // Mesh Configurations
    earth.receiveShadow = true;
    earth.castShadow = true;
    earth.getObjectByName('surface').geometry.center();

    // On window resize, adjust camera aspect ratio and renderer size
    window.addEventListener('resize', function resize () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Main render function
    let render1 = function render () {
      earth.getObjectByName('surface').rotation.y += 1 / 32 * 0.01;
      earth.getObjectByName('atmosphere').rotation.y += 1 / 16 * 0.01;
      if (cameraAutoRotation) {
        cameraRotation += cameraRotationSpeed;
        camera.position.y = 0;
        camera.position.x = 2 * Math.sin(cameraRotation);
        camera.position.z = 2 * Math.cos(cameraRotation);
        camera.lookAt(earth.position);
      }
      requestAnimationFrame(render);
      renderer.render(scene, camera);
    };

    render1();

    // dat.gui
    var gui = new dat.GUI();
    var guiCamera = gui.addFolder('Camera');
    var guiSurface = gui.addFolder('Surface');
    var guiMarkers = guiSurface.addFolder('Markers');
    var guiAtmosphere = gui.addFolder('Atmosphere');
    var guiAtmosphericGlow = guiAtmosphere.addFolder('Glow');

    // dat.gui controls object ---- NEW START
    function CameraControl () {
      this.speed = cameraRotationSpeed;
      this.orbitControls = ! cameraAutoRotation;
    }

    var cameraControls = new CameraControl();

    var surfaceControls = function surfaceControls () {
      this.rotation = 0;
      this.bumpScale = 0.05;
      this.shininess = 10;
    };

    var markersControls = function markersControls () {
      this.address = '';
      this.color = 0xff0000;
      this.placeMarker = function placemarker () {
        placeMarkerAtAddress(this.address, this.color);
      };
    };

    var atmosphereControls = function atmosphereControls () {
      this.opacity = 0.8;
    };

    var atmosphericGlowControls = function atmosphericGlowControls () {
      this.intensity = 0.7;
      this.fade = 7;
      this.color = 0x93cfef;
    };

    // dat.gui controls
    guiCamera.add(cameraControls, 'speed', 0, 0.1).step(0.001).onChange(function speedchange (value) {
      cameraRotationSpeed = value;
    });
    guiCamera.add(cameraControls, 'orbitControls').onChange(function orbitcontrols (value) {
      cameraAutoRotation = ! value;
      orbitControls.enabled = value;
    });

    guiSurface.add(surfaceControls, 'rotation', 0, 6).onChange(function surfaceControls (value) {
      earth.getObjectByName('surface').rotation.y = value;
    });
    guiSurface.add(surfaceControls, 'bumpScale', 0, 1).step(0.01).onChange(function bumpchange (value) {
      earth.getObjectByName('surface').material.bumpScale = value;
    });
    guiSurface.add(surfaceControls, 'shininess', 0, 30).onChange(function shininesschange (value) {
      earth.getObjectByName('surface').material.shininess = value;
    });

    guiMarkers.add(markersControls, 'address');
    guiMarkers.addColor(markersControls, 'color');
    guiMarkers.add(markersControls, 'placeMarker');

    guiAtmosphere.add(atmosphereControls, 'opacity', 0, 1).onChange(function opacitychange (value) {
      earth.getObjectByName('atmosphere').material.opacity = value;
    });

    guiAtmosphericGlow.add(atmosphericGlowControls, 'intensity', 0, 1).onChange(function intensitychange (value) {
      earth.getObjectByName('atmosphericGlow').material.uniforms['c'].value = value;
    });
    guiAtmosphericGlow.add(atmosphericGlowControls, 'fade', 0, 50).onChange(function fadechange (value) {
      earth.getObjectByName('atmosphericGlow').material.uniforms['p'].value = value;
    });
    guiAtmosphericGlow.addColor(atmosphericGlowControls, 'color').onChange(function colorchange (value) {
      earth.getObjectByName('atmosphericGlow').material.uniforms.glowColor.value.setHex(value);
    });
    return this;
  }
});
