/**
 * GraphQL Query Fragments and Builders
 * Centralized query management following DRY principle
 */

/**
 * Common repository fields fragment
 */
export const REPOSITORY_CORE_FIELDS = `
  id
  name
  nameWithOwner
  description
  url
  homepageUrl
  isPrivate
  isFork
  stargazerCount
  forkCount
  watchers { totalCount }
  primaryLanguage { 
    name 
    color 
  }
  languages(first: 10) {
    edges {
      size
      node { name }
    }
    totalSize
  }
  repositoryTopics(first: 10) {
    nodes { 
      topic { name } 
    }
  }
  createdAt
  updatedAt
  pushedAt
  diskUsage
  defaultBranchRef { 
    name 
    target {
      ... on Commit {
        history(first: 5) {
          nodes {
            oid
            message
            author {
              name
            }
            committedDate
          }
        }
      }
    }
  }
  licenseInfo { 
    name 
    key 
  }
  owner {
    login
    avatarUrl
    url
    __typename
  }
`;

/**
 * Tech stack detection fields fragment
 */
export const TECH_STACK_FIELDS = `
  # Tech Stack Detection - Dependency Files
  packageJson: object(expression: "HEAD:package.json") {
    ... on Blob { text }
  }
  requirementsTxt: object(expression: "HEAD:requirements.txt") {
    ... on Blob { text }
  }
  pipfile: object(expression: "HEAD:Pipfile") {
    ... on Blob { text }
  }
  goMod: object(expression: "HEAD:go.mod") {
    ... on Blob { text }
  }
  gemfile: object(expression: "HEAD:Gemfile") {
    ... on Blob { text }
  }
  composerJson: object(expression: "HEAD:composer.json") {
    ... on Blob { text }
  }
  cargoToml: object(expression: "HEAD:Cargo.toml") {
    ... on Blob { text }
  }
  pomXml: object(expression: "HEAD:pom.xml") {
    ... on Blob { text }
  }
  buildGradle: object(expression: "HEAD:build.gradle") {
    ... on Blob { text }
  }
  
  # Framework Config Files
  nextConfig: object(expression: "HEAD:next.config.js") {
    ... on Blob { text }
  }
  viteConfig: object(expression: "HEAD:vite.config.js") {
    ... on Blob { text }
  }
  angularJson: object(expression: "HEAD:angular.json") {
    ... on Blob { text }
  }
  vueConfig: object(expression: "HEAD:vue.config.js") {
    ... on Blob { text }
  }
  nuxtConfig: object(expression: "HEAD:nuxt.config.js") {
    ... on Blob { text }
  }
  
  # Database/ORM Files
  prismaSchema: object(expression: "HEAD:prisma/schema.prisma") {
    ... on Blob { text }
  }
  typeormConfig: object(expression: "HEAD:ormconfig.json") {
    ... on Blob { text }
  }
  sequelizeConfig: object(expression: "HEAD:.sequelizerc") {
    ... on Blob { text }
  }
  
  # DevOps Files
  dockerfile: object(expression: "HEAD:Dockerfile") {
    ... on Blob { text }
  }
  dockerCompose: object(expression: "HEAD:docker-compose.yml") {
    ... on Blob { text }
  }
  githubActions: object(expression: "HEAD:.github/workflows/main.yml") {
    ... on Blob { text }
  }
  gitlabCI: object(expression: "HEAD:.gitlab-ci.yml") {
    ... on Blob { text }
  }
  
  # README for tech mentions
  readme: object(expression: "HEAD:README.md") {
    ... on Blob { text }
  }
`;

/**
 * Complete repository fields (core + tech stack)
 */
export const COMPLETE_REPOSITORY_FIELDS = `
  ${REPOSITORY_CORE_FIELDS}
  ${TECH_STACK_FIELDS}
`;

/**
 * Query builder for scanning user repositories
 */
export function buildUserRepositoriesQuery(): string {
  return `
    query($username: String!, $first: Int!) {
      user(login: $username) {
        repositories(first: $first, orderBy: {field: UPDATED_AT, direction: DESC}) {
          totalCount
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            ${COMPLETE_REPOSITORY_FIELDS}
          }
        }
      }
    }
  `;
}

/**
 * Query builder for scanning single repository
 */
export function buildSingleRepositoryQuery(): string {
  return `
    query($owner: String!, $name: String!) {
      repository(owner: $owner, name: $name) {
        ${COMPLETE_REPOSITORY_FIELDS}
      }
    }
  `;
}
