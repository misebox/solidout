import { createSignal, createMemo, For, Show } from "solid-js";
import apiData from "../api-data.json";
import { TextField } from "../../components/ui/soluid/TextField";
import { Card, CardBody, CardHeader } from "../../components/ui/soluid/Card";
import { Badge } from "../../components/ui/soluid/Badge";
import { HStack } from "../../components/ui/soluid/HStack";

interface PropInfo {
  name: string;
  type: string;
  optional: boolean;
}

interface ComponentApi {
  name: string;
  description: string;
  dependencies: string[];
  props: PropInfo[];
}

const data = apiData as ComponentApi[];

export function ApiPage() {
  const [filter, setFilter] = createSignal("");

  const filtered = createMemo(() => {
    const q = filter().toLowerCase();
    if (!q) return data;
    return data.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q),
    );
  });

  return (
    <div class="api-page">
      <div class="api-search">
        <TextField
          label="Search components"
          placeholder="Filter by name or description..."
          value={filter()}
          onInput={setFilter}
        />
      </div>
      <p class="api-count">{filtered().length} of {data.length} components</p>
      <div class="api-list">
        <For each={filtered()}>
          {(comp) => (
            <Card class="api-card">
              <CardHeader>
                <HStack gap={2}>
                  <span class="api-component-name">{comp.name.replace(/Props$/, "")}</span>
                  <Show when={comp.dependencies.length > 0}>
                    <For each={comp.dependencies}>
                      {(dep) => <Badge variant="neutral" size="sm">{dep}</Badge>}
                    </For>
                  </Show>
                </HStack>
              </CardHeader>
              <CardBody>
                <Show when={comp.description}>
                  <p class="api-description">{comp.description}</p>
                </Show>
                <table class="api-table">
                  <thead>
                    <tr>
                      <th>Prop</th>
                      <th>Type</th>
                      <th>Required</th>
                    </tr>
                  </thead>
                  <tbody>
                    <For each={comp.props}>
                      {(prop) => (
                        <tr>
                          <td><code>{prop.name}</code></td>
                          <td><code>{prop.type}</code></td>
                          <td>{prop.optional ? "" : "Yes"}</td>
                        </tr>
                      )}
                    </For>
                  </tbody>
                </table>
              </CardBody>
            </Card>
          )}
        </For>
      </div>
    </div>
  );
}
