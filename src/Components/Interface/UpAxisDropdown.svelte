<script lang="ts">
  import * as axes from "../../constants/axes";

  const options = Object.keys(axes).map((axisName): string => axes[axisName]);

  export let selectedUpAxis: string;
</script>

<div class="flex mb-4 bg-slate-900 p-2 rounded-lg align-middle">
  <div class="mr-16 align-middle p-1">
    <i data-feather="circle" />
    <span class="text-slate-300 align-middle">Axis Up Convention:</span>
  </div>
  <div class="justify-self-end">
    <select
      class="text-slate-300 text-white w-11 h-8 bg-slate-800 rounded-lg p-1 content-center justify-self-end"
      bind:value={selectedUpAxis}
    >
      {#each options as option}
        <option value={option}>{option}</option>
      {/each}
    </select>
  </div>
</div>
