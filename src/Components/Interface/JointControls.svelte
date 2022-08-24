<script lang="ts">
  import type { JointInfo } from "../../types";
  export let jointInfos: JointInfo[];
</script>

<ul class="menu rounded-box bg-base-100">
  <li class="menu-title">
    <span>Joint Controls</span>
  </li>
  {#each jointInfos as jointInfo, idx}
    <li>
      <div class="flex flex-row">
        <div class="flex w-full items-center justify-center align-middle">
          <span class="text-sm mb-2 w-32">
            {`${idx}`} : {jointInfo.name}
          </span>
          <input
            class="range range-primary range-xs mr-4 w-full w-40"
            bind:value={jointInfo.degree}
            type="range"
            min={jointInfo.lower}
            max={jointInfo.upper}
          />
          <input
            class="text-center p-1 w-14 h-6 bg-base-300 rounded"
            bind:value={jointInfo.degree}
            type="text"
          />
        </div>
      </div>
    </li>
  {/each}
</ul>
