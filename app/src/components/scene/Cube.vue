<template>
  <vgl-mesh geometry="cube" material="std" :position="position"></vgl-mesh>
</template>

<script>
export default {
    props: [
        'position'
    ]
}
</script>
