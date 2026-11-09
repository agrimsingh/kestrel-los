package com.kestrel.framework;

public final class KestrelContext {
  private final String correlationId;

  public KestrelContext(String correlationId) {
    this.correlationId = correlationId;
  }

  public String correlationId() {
    return correlationId;
  }
}
