
precision mediump float;

uniform float time;
uniform vec2 resolution;

mat2 rotation (float a) { float c=cos(a),s=sin(a); return mat2(c,-s,s,c); }