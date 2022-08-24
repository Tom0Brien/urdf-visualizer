<script lang="ts">
  import { onMount } from "svelte";
  import type { JointInfo } from "../../types";
  import createScene, {
    rotateJoints,
    loadRobot,
    rotateRobotOnUpAxisChange,
  } from "./createScene";
  import readDirectory from "./readDirectory";

  let canvasEl: HTMLCanvasElement;

  // Receive the props `jointInfos` from parent component
  export let jointInfos: JointInfo[];
  // Re-run `rotateJoints` on `jointInfos` change.
  // $: <statement> is reactive declaration.
  $: rotateJoints(jointInfos);

  export let selectedUpAxis: string;
  $: rotateRobotOnUpAxisChange(selectedUpAxis);

  onMount(() => {
    createScene(canvasEl);
  });

  function cancelEventDefaultBehaviors(evt: DragEvent): void {
    evt.stopPropagation();
    evt.preventDefault();
  }

  async function handleDrop(evt: DragEvent): Promise<void> {
    cancelEventDefaultBehaviors(evt);

    const { items } = evt.dataTransfer;
    const files: Record<string, File> = {};

    await readDirectory(items, files);

    const urdfFileName = Object.keys(files).find(
      (fileName: string): boolean => {
        return /.urdf/i.test(fileName);
      }
    );

    if (!urdfFileName) {
      alert("Please upload a valid URDF file");
      return;
    }

    console.log(files);

    // Create a new object URL represents the file.
    const urdfFileURL = URL.createObjectURL(files[urdfFileName]);
    requestAnimationFrame((): void => {
      URL.revokeObjectURL(urdfFileURL);
    });
    loadRobot(urdfFileURL, files);
  }
</script>

<!-- Bind the canvas to `canvasEl` on component mount -->
<div class="drawer-content">
  <canvas
    bind:this={canvasEl}
    on:dragenter={cancelEventDefaultBehaviors}
    on:dragover={cancelEventDefaultBehaviors}
    on:drop={handleDrop}
  />
</div>
