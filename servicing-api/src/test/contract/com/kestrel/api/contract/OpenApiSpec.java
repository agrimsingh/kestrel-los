package com.kestrel.api.contract;

import java.io.IOException;
import java.io.Reader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;
import org.yaml.snakeyaml.Yaml;

/** Reads contracts/openapi.yaml for contract tests. Maven runs tests from servicing-api/. */
final class OpenApiSpec {
  private static final Path SPEC = Path.of("..", "contracts", "openapi.yaml");

  private final Map<String, Object> root;

  private OpenApiSpec(Map<String, Object> root) {
    this.root = root;
  }

  static OpenApiSpec load() throws IOException {
    try (Reader reader = Files.newBufferedReader(SPEC)) {
      return new OpenApiSpec(new Yaml().load(reader));
    }
  }

  /** The operation at {@code method path}, or null if the spec does not declare it. */
  Map<String, Object> operation(String method, String path) {
    Map<String, Object> pathItem = child(child(root, "paths"), path);
    return pathItem == null ? null : child(pathItem, method);
  }

  /** The {@code required} property names of a schema under components/schemas. */
  @SuppressWarnings("unchecked")
  List<String> requiredProperties(String schemaName) {
    Map<String, Object> schema = child(child(child(root, "components"), "schemas"), schemaName);
    return (List<String>) schema.get("required");
  }

  @SuppressWarnings("unchecked")
  static Map<String, Object> child(Map<String, Object> node, String key) {
    return (Map<String, Object>) node.get(key);
  }
}
