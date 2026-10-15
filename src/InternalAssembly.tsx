import { renderParts } from "./manifest";
import { PartMesh, isInternal } from "./Scene";
export default function InternalAssembly(
  props: Omit<Parameters<typeof PartMesh>[0], "p">,
) {
  return (
    <>
      {renderParts.filter(isInternal).map((p) => (
        <PartMesh key={p.id} p={p} {...props} />
      ))}
    </>
  );
}
