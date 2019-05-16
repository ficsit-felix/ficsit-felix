<template>
    <div class="toolpanel">
        <div class="section">
        <a @mousedown.stop="$emit('setTranslate');" :class="{active:translateActive}">Translate</a>
        <a @mousedown.stop="$emit('setRotate')" :class="{active:rotateActive}">Rotate</a>
        <a @mousedown.stop="$emit('setScale')" :class="{active:scaleActive}">Scale</a>
</div>
<div class="section">
        <a @mousedown.stop="$emit('setWorld')" :class="{active:worldActive}">World</a>
        <a @mousedown.stop="$emit('setLocal')" :class="{active:localActive}">Local</a>
        </div>
    </div>
</template>


<style lang="scss" scoped>
.toolpanel {
    position: absolute;
    top: 15px;
    .section {
        display: inline-block;
        padding: 10px;
    }
    a {
        padding: 10px;
        margin: 4px;
        background: rgba(255,255,255, 0.1);
        color: #fff;
        text-shadow: 1px 1px 1px #000;
        border-radius: 20px;
        border: rgba(255,255,255,0.2) solid 1px;
        cursor: pointer;
        &.active {
            background: rgba(255,255,255,0.3);
            border: rgba(255,255,255,0.4) solid 1px;
        }
        user-select: none;
    }
    a:hover {
        background: rgba(255,255,255, 0.15);
        color: #fff;
        text-decoration: none;
        &.active {
            background: rgba(255,255,255,0.3);
        }
    }

    a:active {
        background: rgba(255,255,255, 0.3);
    }
}
</style>


<script>
export default {
    name: "ToolPanel",
    components: {

    }, 
    props: [
        'mode',
        'local'
    ],
    computed: {
        translateActive() {
            return this.mode === "translate";
        },
        rotateActive() {
            return this.mode === "rotate";
        },
        scaleActive() {
            return this.mode === "scale";
        },
        localActive() {
            return this.local;
        },
        worldActive() {
            return !this.local;
        }
    }
}
</script>
