<script lang="ts">
  import { jointInfosStore, selectedUpAxisStore } from "../../stores";
  import type { JointInfo } from "../../types";

  import Interface from "../Interface/index.svelte";
  import Scene from "../Scene/index.svelte";

  let jointInfos: JointInfo[] = [];
  jointInfosStore.subscribe((value: JointInfo[]): void => {
    jointInfos = value;
  });

  let selectedUpAxis = "";
  selectedUpAxisStore.subscribe((value: string): void => {
    selectedUpAxis = value;
  });
</script>

<!-- 
  When passing `props` to a child component, use `bind` only if it is 
  a two way binding, which means the child component will also update the `props` 
  in the parent component.
-->
<Interface bind:jointInfos bind:selectedUpAxis />
<Scene {jointInfos} {selectedUpAxis} />

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
