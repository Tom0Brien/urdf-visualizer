<script lang="ts">
  import type { JointInfo } from "../../types";

  export let jointInfos: JointInfo[];
</script>

<div class="w-88 mb-16">
  <!-- <div class=" mb-4">
    <span class="text-white text-xl">Joint Controls</span>
  </div> -->
  <div class="h-max">
    {#each jointInfos as jointInfo, idx}
      <div class="bg-slate-900 px-4 pt-2 mb-4 rounded-lg">
        <label class="block">
          <span class="text-slate-300">{`${idx}`} : {jointInfo.name}</span>
          <div class="flex">
            <input
              class="mr-4"
              bind:value={jointInfo.degree}
              type="range"
              min={jointInfo.lower}
              max={jointInfo.upper}
            />
            <input
              class="text-slate-300 w-9 h-9 bg-slate-800 rounded-lg mb-4 p-1 content-center"
              bind:value={jointInfo.degree}
              type="text"
            />
          </div>
        </label>
      </div>
    {/each}
  </div>
</div>
