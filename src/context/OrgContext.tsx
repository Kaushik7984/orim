"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Org = { id: string; name: string };

interface OrgContextType {
  orgId: string | null;
  setOrgId: (id: string) => void;
  orgs: Org[];
}

const OrgContext = createContext<OrgContextType>({
  orgId: null,
  setOrgId: () => {},
  orgs: [],
});

export const useOrg = () => useContext(OrgContext);

export function OrgProvider({ children }: { children: React.ReactNode }) {
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [orgId, setOrgId] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/organizations", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setOrgs(data);
        if (data.length > 0) setOrgId(data[0].id);
      });
  }, []);

  return (
    <OrgContext.Provider value={{ orgId, setOrgId, orgs }}>
      {children}
    </OrgContext.Provider>
  );
}
