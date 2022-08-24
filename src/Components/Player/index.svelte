<script lang="ts">
  import Player from "./Player.svelte";
  import type { JointInfo } from "../../types";

  export let jointInfos: JointInfo[];
</script>

<div class="top-0 bg-white border-b border-slate-200 w-screen h-8">
  <Player bind:jointInfos />
</div>
