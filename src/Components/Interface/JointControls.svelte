<script lang="ts">
  import type { JointInfo } from "../../types";

  export let jointInfos: JointInfo[];
</script>

<div class="w-88 mb-16">
  <!-- <div class=" mb-4">
    <span class="text-white text-xl">Joint Controls</span>
  </div> -->
  <div class="h-max flex flex-col bg-slate-900 rounded-lg px-2 ">
    {#each jointInfos as jointInfo, idx}
      <div class="px-2 py-2 mb-4 ">
        <div class="flex flex-row">
          <div class="flex flex-col w-full text-center">
            <span class="text-slate-300 text-sm mb-2">
              Joint {`${idx}`} : {jointInfo.name}
            </span>
            <div class="w-full flex">
              <input
                class="mr-4 w-full"
                bind:value={jointInfo.degree}
                type="range"
                min={jointInfo.lower}
                max={jointInfo.upper}
              />
              <input
                class="text-slate-300 text-center p-2 w-9 h-6 bg-slate-800 rounded"
                bind:value={jointInfo.degree}
                type="text"
              />
            </div>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>
