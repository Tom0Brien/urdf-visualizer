<script lang="ts">
  import type { JointInfo } from "../../types";

  import UpAxisDropdown from "./UpAxisDropdown.svelte";
  import JointControls from "./JointControls.svelte";
  import Header from "./Header.svelte";

  export let jointInfos: JointInfo[];
  export let selectedUpAxis: string;
</script>

<div class="bg-slate-800 w-76 h-screen absolute z-20 px-4 pt-4">
  <Header />
  <UpAxisDropdown bind:selectedUpAxis />
  <JointControls bind:jointInfos />
</div>
