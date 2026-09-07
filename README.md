# HomeLab Hub

Build a complete one-day MVP called “HomeLab Dashboard” for homelabbers, Linux/networking enthusiasts, and self-hosting users. Make it portfolio-quality, modern, clean, responsive, and easy to export to GitHub and continue coding later.

IMPORTANT SCOPE: Keep this MVP small and reliable. Do NOT add authentication, payments, complex backend infrastructure, real-time monitoring, Docker integrations, external APIs, or complicated deployment systems. Prefer localStorage for persistence so the app works immediately without configuration. Structure the code cleanly and modularly so Firebase/Supabase and real monitoring can be added later.

CORE APP:
1. Dashboard/Home: show total devices, online/offline status counts, total RAM, total storage, and recent devices. Include a clean status overview and quick “Add Device” action.
2. Devices page: searchable/filterable list or cards of devices. Support adding, editing, deleting, and viewing devices.
3. Device fields: name, device type (PC, Server, NAS, Raspberry Pi, VM, Laptop, Other), status (Online, Offline, Maintenance), OS, CPU, RAM, storage, IP/hostname, location, services, and notes.
4. Device detail view: display all information clearly, including service tags and status.
5. Services: represent services attached to a device (examples: SSH, SMB, Jellyfin, Nginx, Docker, etc.) with name and status. Keep this as manually managed data only; do not attempt real monitoring.
6. Settings: theme toggle, demo data reset, and clear local data.
7. Add a small AI Assistant panel/page as a FUTURE placeholder. Make it visually integrated and useful-looking, but do not require an AI API. Include example suggested prompts such as “What should I monitor on my server?” and “Explain this Linux service.” Clearly keep it non-functional or mock-only for v1.

DESIGN:
- Modern homelab/dev-tool aesthetic, not a generic business dashboard.
- Dark mode as the primary feel, with a polished light mode too.
- Clean sidebar navigation on desktop and mobile-friendly navigation on small screens.
- Use cards, badges, compact tables/lists, subtle borders, good spacing, and clear status indicators.
- Avoid excessive animations, gradients, giant hero sections, or unnecessary decorative elements.
- Make typography and hierarchy excellent and the UI feel like a real open-source tool.
- Include a small “HomeLab Dashboard” brand/logo treatment.

TECHNICAL:
- Use the default Lovable stack with React + TypeScript + Tailwind + shadcn/ui.
- Use localStorage for device/service data and app settings.
- Seed the app with realistic demo homelab data on first launch so the dashboard immediately looks populated. Make it easy to reset/remove demo data.
- Use reusable components and sensible file organization.
- Keep types/interfaces centralized and code easy to understand.
- Ensure empty states, validation, delete confirmations, responsive layouts, and basic error handling.
- Do not leave broken buttons or fake navigation.

FINAL GOAL: Deliver a polished, functional MVP that can realistically be built in one day and then exported to GitHub. Prioritize working core functionality over adding more features. Do not expand the scope beyond what is specified here.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/527d5213-ed31-47a2-83f8-b94999309648).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
