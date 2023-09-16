import PageTitle from "../../util/PageTitle";

export default function ExtractingGameAssets() {
    return <>
        <PageTitle>Extracting BTD6 Assets (3D Models, Music, etc.)</PageTitle>
        <h2>Steps (current as of 2023-09-15)</h2>
        <ol>
            <li>Download and extract <a href="https://github.com/AssetRipper/AssetRipper/releases">AssetRipper</a></li>
            <li>
                In AssetRipper, open the BTD6 game folder
                <ul>
                    <li>To go to the folder, open Steam and go to Library &gt; Bloons TD 6 &gt; (Gear Icon) &gt; Manage &gt; Browse local files</li>
                    <li>Ignore any &ldquo;Unable to read MonoBehaviour Structure&rdquo; errors in the AssetRipper logs</li>
                </ul>
            </li>
            <li>In AssetRipper click Export &gt; Export all Files and choose an empty folder to extract to</li>
            <li>
                Textures and sound files can be used directly in standard image/music software. For 3D models, perform the following steps.
                <ol type="a">
                    <li>Download and install <a href="https://unity.com/download">Unity</a> (<a href="https://www.msn.com/en-us/news/technology/developers-fight-back-against-unity-s-new-pricing-model/ar-AA1gMQSq">sholthink</a>) if you don't already have it</li>
                    <li>
                        In Unity open the BloonsTD6 &gt; ExportedProject folder inside the chosen AssetRipper export folder as a new project
                        <ul>
                            <li>If Unity complains about compilation errors then ignore them</li>
                        </ul>
                    </li>
                    <li>Install the <a href="https://docs.unity3d.com/Packages/com.unity.formats.fbx@2.0/manual/index.html">FBX Exporter</a> package, following the linked instructions. You may need to restart Unity to see the &ldquo;Export to FBX&rdquo; option.</li>
                    <li>Open the desired .prefab (Unity 3D model) file. Note that some tower models are in Assets &gt; Generated &gt; Assets &gt; Monkeys rather than the usual Assets &gt; Monkeys.</li>
                    <li>
                        Go to GameObject &gt; Export to FBX to export the file as an FBX model usable by most 3D programs.
                        <ul>
                            <li>Blender, the main free 3D model editor, can open FBX, though it has some bugs in the importer. For best results you may want to convert the model into an .obj first using e.g. <a href="https://www.autodesk.com/developer-network/platform-technologies/fbx-converter-archives">FBX Converter</a>.</li>
                        </ul>
                    </li>
                </ol>
            </li>
        </ol>
    </>;
}