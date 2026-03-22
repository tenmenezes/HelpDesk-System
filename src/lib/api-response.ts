// src/lib/api-response.ts
// Helpers padronizados para respostas de API

import { NextResponse } from "next/server";

export function ok<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function created<T>(data: T) {
  return NextResponse.json(data, { status: 201 });
}

export function badRequest(message: string) {
  return NextResponse.json({ success: false, message }, { status: 400 });
}

export function unauthorized(message = "Não autenticado") {
  return NextResponse.json({ success: false, message }, { status: 401 });
}

export function forbidden(message = "Sem permissão") {
  return NextResponse.json({ success: false, message }, { status: 403 });
}

export function notFound(message = "Recurso não encontrado") {
  return NextResponse.json({ success: false, message }, { status: 404 });
}

export function conflict(message: string) {
  return NextResponse.json({ success: false, message }, { status: 409 });
}

export function serverError(message = "Erro interno do servidor") {
  return NextResponse.json({ success: false, message }, { status: 500 });
}

export function success(message: string, data?: object) {
  return NextResponse.json({ success: true, message, ...data });
}
