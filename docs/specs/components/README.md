# Component requirements documents

One CRD per ShotThere component: `<component>.md` holds the requirements and
Given/When/Then acceptance criteria traced to [L2](../L2.md);
`<component>.html` renders the component in every variant, size and state in
light and dark with the design system's real stylesheets. `<component>` is the
design-system page slug; the two library parts with no component page use their
library folder name (`icon`, `responsive-image`).

Each CRD works inside [ICD-002](../../icd/components-library.md), which fixes
every selector, input, output, slot and type that crosses the boundary between
the components library and the application. A CRD adds states, styling,
behaviour and acceptance criteria; it never changes the boundary. Where a CRD
needed something ICD-002 1.0.0 did not allow, the ICD was changed first
(additive, version 1.1.0) and the CRD records it under *Decisions*.

Check them with:

```sh
python .claude/skills/writing-component-requirements-documents/scripts/check_crds.py docs/specs/components
```

## Conventions every CRD follows

- **Selectors** use the `st` prefix (ICD-002 D-2): `st-` plus the design-system
  slug for components, an attribute selector on a native element where the
  native element must be kept (`button[st-button]`, `table[st-table]`), and
  `st` plus camel case for directives (`img[stFallbackImage]`). Application
  components specified here (rows marked *application*) use the same prefix and
  live in `frontend/projects/shot-there/src/app/features/<area>/<component>/`;
  library components live in `frontend/projects/components/src/lib/<folder>/`.
- **Ownership** follows ICD-002 §11.2: a design-system block owned by
  application feature CSS is specified as an application component, and the
  library parts it composes are referenced, not re-specified.
- **Shared field contract.** [`form-field.md`](form-field.md) specifies the
  `.field` structure (label, optional marker, help, error, warning,
  `aria-describedby`, `aria-invalid`, generated IDs) that every form control in
  ICD-002 §9.2 renders; each control's CRD specifies only what is its own.
- **Performance scenario.** There is no separate perf-test project. Each CRD
  names a route in the `components-harness` application (ICD-002 D-12),
  `<component>/performance`, that renders a realistic instance from the
  [mocks cast](../../mocks/README.md); the render or interaction budget it is
  held to traces to L2-071.
- **Motion and forced colours.** L2 has no motion requirement, so
  reduced-motion behaviour is stated as a design-system rule in each CRD's
  *Accessibility › Motion* and has no acceptance criterion.
- **Strings.** Product copy reaches components through inputs and slots; the
  only text a library component renders on its own is listed in ICD-002 §12.

## Index

| Component | Selector | Status | Traces to | Requirements | Rendering | Design system |
|---|---|---|---|---|---|---|
| Button | `button[st-button]`, `a[st-button]` | planned | L2-030, L2-041, L2-049, L2-058, L2-061, L2-064, L2-065, L2-066, L2-067, L2-068, L2-069, L2-071 | [button.md](button.md) | [button.html](button.html) | [button](../../design-system/components/button.html) |
