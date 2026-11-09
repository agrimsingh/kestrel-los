package com.kestrel.framework;

public abstract class KestrelHandler<T> {
  public abstract void handle(KestrelContext ctx, T payload);
}
