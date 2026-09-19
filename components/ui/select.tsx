"use client";
import * as React from "react";
type Ctx = { value?: string; onValueChange?: (v: string) => void };
const SelectContext = React.createContext<Ctx>({});
export function Select({ value, onValueChange, children }: { value?: string; onValueChange?: (v: string) => void; children: React.ReactNode }) { return <SelectContext.Provider value={{ value, onValueChange }}>{children}</SelectContext.Provider>; }
export function SelectTrigger({ children, className }: { children: React.ReactNode; className?: string }) { return <div className={className}>{children}</div>; }
export function SelectValue({ placeholder }: { placeholder?: string }) { const { value } = React.useContext(SelectContext); return <span>{value || placeholder}</span>; }
export function SelectContent({ children }: { children: React.ReactNode }) { const { value, onValueChange } = React.useContext(SelectContext); const options = React.Children.toArray(children).map((child: any) => ({ value: child.props.value, label: child.props.children })); return <select aria-label="Seçim" value={value || ""} onChange={e => onValueChange?.(e.target.value)} style={{width:"100%",marginTop:".5rem",background:"transparent",border:0,font:"inherit"}}><option value="" disabled>Seçiniz</option>{options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select>; }
export function SelectItem(_props: { value: string; children: React.ReactNode }) { return null; }
