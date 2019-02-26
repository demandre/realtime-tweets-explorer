// Libs
var Backbone = require('backbone');
var akTemplate = require('ak-template');
const THREE = require('three');
var OrbitControls = require('three-orbit-controls')(THREE);
// Template
var tpl = require('./index.tpl');

// Controller - view
module.exports = Backbone.View.extend({
  'el': '.tweet-explorer',
  'template': akTemplate(tpl),
  'earth': null,
  'markerProto': null,
  'placeMarker': null,
  'render': function render () {
    var container = Backbone.$(this.template()).appendTo(this.$el);

    // Scene, Camera, Renderer
    var renderer = new THREE.WebGLRenderer();
    var scene = new THREE.Scene();
    var aspect = container.innerWidth() / container.innerHeight();
    var camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1500);
    var cameraAutoRotation = false;
    var orbitControls = new OrbitControls(camera);
    var light = new THREE.AmbientLight(0xffffff);

    // Texture Loader
    var textureLoader = new THREE.TextureLoader();

    // Planet Proto
    var planetProto = {
      'sphere': function sphere (size) {
        var sphere1 = new THREE.SphereGeometry(size, 32, 32);

        return sphere1;
      },
      'material': function material (options) {
        var material1 = new THREE.MeshPhongMaterial();

        if (options) {
          for (var property in options) {
            material1[property] = options[property];
          }
        }

        return material1;
      },
      'glowMaterial': function glowMaterial (intensity, fade, color) {
        // Custom glow shader from https://github.com/stemkoski/stemkoski.github.com/tree/master/Three.js
        var glowMaterial1 = new THREE.ShaderMaterial({
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
        var textureLoader = new THREE.TextureLoader();

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

    var createPlanet = function createPlanet (options) {
      // Create the planet's Surface
      var surfaceGeometry = planetProto.sphere(options.surface.size);
      var surfaceMaterial = planetProto.material(options.surface.material);
      var surface = new THREE.Mesh(surfaceGeometry, surfaceMaterial);

      // Create the planet's Atmosphere
      var atmosphereGeometry = planetProto.sphere(options.surface.size + options.atmosphere.size);
      var atmosphereMaterialDefaults = {
        'side': THREE.DoubleSide,
        'transparent': true
      };
      var atmosphereMaterialOptions = Object.assign(atmosphereMaterialDefaults, options.atmosphere.material);
      var atmosphereMaterial = planetProto.material(atmosphereMaterialOptions);
      var atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);

      // Create the planet's Atmospheric glow
      var atmosphericGlowGeometry = planetProto.sphere(options.surface.size + options.atmosphere.size + options.atmosphere.glow.size);
      var atmosphericGlowMaterial = planetProto.glowMaterial(options.atmosphere.glow.intensity, options.atmosphere.glow.fade, options.atmosphere.glow.color);
      var atmosphericGlow = new THREE.Mesh(atmosphericGlowGeometry, atmosphericGlowMaterial);

      // Nest the planet's Surface and Atmosphere into a planet object
      var planet = new THREE.Object3D();

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

    var earth = createPlanet({
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
          'opacity': 0.3
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
    this.markerProto = {
      'latLongToVector3': function latLongToVector3 (latitude, longitude, radius, height) {
        var phi = latitude * Math.PI / 180;
        var theta = (longitude - 180) * Math.PI / 180;

        var x = - (radius + height) * Math.cos(phi) * Math.cos(theta);
        var y = (radius + height) * Math.sin(phi);
        var z = (radius + height) * Math.cos(phi) * Math.sin(theta);

        return new THREE.Vector3(x, y, z);
      },
      'marker': function marker (size, color, vector3Position) {
        var markerGeometry = new THREE.SphereGeometry(size);
        var markerMaterial = new THREE.MeshLambertMaterial({
          'color': color
        });
        var markerMesh = new THREE.Mesh(markerGeometry, markerMaterial);

        markerMesh.position.copy(vector3Position);

        return markerMesh;
      }
    };

    // Place Marker
    this.placeMarker = function placeMarker (object, options) {
      var position = this.markerProto.latLongToVector3(options.latitude, options.longitude, options.radius, options.height);
      var marker = this.markerProto.marker(options.size, options.color, position);

      object.add(marker);
    };

    // Galaxy
    var galaxyGeometry = new THREE.SphereGeometry(100, 32, 32);
    var galaxyMaterial = new THREE.MeshBasicMaterial({
      'side': THREE.BackSide
    });
    var galaxy = new THREE.Mesh(galaxyGeometry, galaxyMaterial);

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
    renderer.setSize(container.innerWidth(), container.innerHeight());
    container.append(renderer.domElement);

    camera.position.set(1, 1, 1);
    orbitControls.enabled = ! cameraAutoRotation;

    scene.add(camera);
    scene.add(earth);
    scene.add(light);

    // Mesh Configurations
    earth.receiveShadow = true;
    earth.castShadow = true;
    earth.getObjectByName('surface').geometry.center();

    // On window resize, adjust camera aspect ratio and renderer size
    window.addEventListener('resize', function resize () {
      camera.aspect = container.innerWidth() / container.innerHeight();
      camera.updateProjectionMatrix();
      renderer.setSize(container.innerWidth(), container.innerHeight());
    });

    // Main render function
    var renderEarth = function render () {
      earth.getObjectByName('surface').rotation.y += 1 / 32 * 0.01;
      earth.getObjectByName('atmosphere').rotation.y += 1 / 16 * 0.01;
      camera.lookAt(earth.position);
      requestAnimationFrame(render);
      renderer.render(scene, camera);
    };

    renderEarth();

    this.earth = earth;

    return this;
  },
  'refreshMarkers': function refreshMarkers () {
    this.collection.forEach(function foreach (model) {
      if (model.attributes.geo !== null) {
        console.log(model.attributes.geo);
        this.placeMarker(this.earth.getObjectByName('surface'), {
          'latitude': model.attributes.geo.coordinates[0],
          'longitude': model.attributes.geo.coordinates[1],
          'radius': 0.5,
          'height': 0,
          'size': 0.01,
          'color': 0xfff000
        });
      }
    }.bind(this));
  }
});
