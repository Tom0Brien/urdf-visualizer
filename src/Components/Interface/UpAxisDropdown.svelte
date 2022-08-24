<script lang="ts">
  import * as axes from "../../constants/axes";

  const options = Object.keys(axes).map((axisName): string => axes[axisName]);

  export let selectedUpAxis: string;
</script>

<ul class="menu bg-base-100 rounded-box">
  <li tabindex="0" class="flex">
    <div class="flex justify-between">
      Axis Up Convention
      <select
        class="w-14 h-6 bg-base-300 rounded p-1 justify-self-end"
        bind:value={selectedUpAxis}
      >
        {#each options as option}
          <option value={option}>{option}</option>
        {/each}
      </select>
    </div>
  </li>
</ul>
