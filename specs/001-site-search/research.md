# Research: Site-Wide Search

## Scope Decision

**Decision**: Search covers all four entity types (Events, Forum Threads,
Members, Contact Messages).

**Rationale**: User request explicitly listed all entities. Members and
Messages are gated behind admin auth, so non-admin visitors are unaffected.

**Alternatives considered**: Events + Forum only — simpler but leaves the
issue only half-resolved.

## Search Strategy

**Decision**: Client-side search against existing API endpoints, not a
dedicated search endpoint.

**Rationale**: The project uses MSW for dev mocking with no backend available.
Client-side search is the fastest path to a working feature. A dedicated
search endpoint can be added server-side later as an enhancement.

**Trade-offs**:
- + No backend changes required
- + Works immediately with MSW mock data
- - Performance degrades with very large datasets (mitigation: debounce,
  loading states)
- - No full-text search capabilities (simple keyword matching)

## Routing Strategy

**Decision**: React Router v7 search params (`useSearchParams`) for the
search page at `/search?q=query`.

**Rationale**: Standard React Router pattern already used in the project.
Search params are bookmarkable and support browser back/forward navigation.

## Auth Gating

**Decision**: Use existing AuthContext (`useAuth().user`) to determine
whether to include Members and Messages in search results.

**Rationale**: AuthContext is already available app-wide. No additional auth
infrastructure needed.

## Result Matching Algorithm

**Decision**: Simple substring matching on title and content fields, with
exact matches ranked first.

**Rationale**: Appropriate for v1 with client-side search. Can be replaced
with a proper search index later.

## Forum Inline Filter

**Decision**: Client-side real-time filtering using existing thread list
data, with additional category and status dropdowns.

**Rationale**: The forum page already fetches threads via React Query.
In-memory filtering is instant for typical dataset sizes.
