<script lang="ts">
  import type { JointInfo } from "../../types";

  import UpAxisDropdown from "./UpAxisDropdown.svelte";
  import JointControls from "./JointControls.svelte";
  import Header from "./Header.svelte";

  export let jointInfos: JointInfo[];
  export let selectedUpAxis: string;
</script>

<div class="drawer-side bg-base-200 w-76 h-screen absolute z-20 px-4 pt-4">
  <label for="my-drawer" class="drawer-overlay" />
  <Header />
  <UpAxisDropdown bind:selectedUpAxis />
  <div class="divider" />
  <JointControls bind:jointInfos />
</div>
