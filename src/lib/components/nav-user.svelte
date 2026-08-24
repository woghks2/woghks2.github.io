<script lang="ts">
  import { MoreVertical } from "@lucide/svelte";
  import * as Avatar from "$lib/components/ui/avatar/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import Discord from "$lib/components/icons/discord.svelte";
  import Github from "$lib/components/icons/github.svelte";
  import Gmail from "$lib/components/icons/gmail.svelte";
  import Linkedin from "$lib/components/icons/linkedin.svelte";

  let { user }: { user: { name: string; avatar: string } } = $props();
  const sidebar = Sidebar.useSidebar();

  const profileLinks = [
    {
      label: "Github",
      href: "https://github.com/woghks2",
      icon: Github
    },
    {
      label: "Discord",
      href: "https://discord.com",
      icon: Discord
    },
    {
      label: "Gmail",
      href: "mailto:tbxkdls19@gmail.com",
      icon: Gmail
    },
    {
      label: "Linkedin",
      href: "https://linkedin.com/in/your-profile",
      icon: Linkedin
    }
  ];
</script>

<Sidebar.Menu>
  <Sidebar.MenuItem>
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        {#snippet child({ props })}
          <Sidebar.MenuButton
            {...props}
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <Avatar.Root class="size-8 rounded-lg">
              <Avatar.Image src={user.avatar} alt={user.name} />
              <Avatar.Fallback class="rounded-lg">CN</Avatar.Fallback>
            </Avatar.Root>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-semibold">{user.name}</span>
            </div>
            <MoreVertical class="ml-auto size-4" />
          </Sidebar.MenuButton>
        {/snippet}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        class="w-(--bits-dropdown-menu-anchor-width) min-w-56 rounded-lg"
        side={sidebar.isMobile ? "bottom" : "right"}
        align="end"
        sideOffset={4}
      >
        <DropdownMenu.Group>
          {#each profileLinks as link}
            <DropdownMenu.Item>
              {#snippet child({ props })}
                <a href={link.href} target="_blank" rel="noopener noreferrer" {...props}>
                  <link.icon size="16" />
                  {link.label}
                </a>
              {/snippet}
            </DropdownMenu.Item>
          {/each}
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </Sidebar.MenuItem>
</Sidebar.Menu>
